// app/lib/api.ts
const BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const doFetch = () => fetch(BASE + endpoint, { ...options, headers });
  const method = (options.method || "GET").toUpperCase();

  try {
    return await doFetch();
  } catch (e) {
    // Only retry GETs (safe to repeat). POST/PUT/PATCH/DELETE are not idempotent,
    // e.g. a retried lesson toggle can flip the state twice.
    if (method !== "GET") throw e;
    // Render free tier may be asleep: wait and retry once on network failure
    await sleep(4000);
    return doFetch();
  }
};

// FastAPI returns `detail` as a string for HTTPException and as a list for 422 validation errors.
// This turns either into a readable message.
function errorMessage(err: any, fallback: string): string {
  const d = err?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d) && d.length) {
    return d
      .map((x) => (typeof x?.msg === "string" ? x.msg.replace(/^Value error,\s*/i, "") : ""))
      .filter(Boolean)
      .join(", ") || fallback;
  }
  return fallback;
}

// Throws on non-2xx so pages can show a real error state
async function getJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await authFetch(endpoint, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(errorMessage(err, `Request failed (${res.status})`));
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Builds fetch options for a write request
const send = (method: string, body?: unknown): RequestInit => ({
  method,
  ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
});

/* ── Types (match the live openapi.json) ── */
export interface EnrollmentOut {
  id: string;
  course_id: string;
  course_title: string;
  course_thumbnail_url?: string | null;
  course_language: string;
  course_level: string;
  status: string;
  progress_percentage: number;
  total_lessons: number;
  completed_lessons: number;
  enrolled_at: string;
  completed_at?: string | null;
}

export interface PaymentOrder {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResponse {
  success?: boolean;
  message?: string;
}

export interface ArticleOut {
  id: string;
  title: string;
  slug?: string | null;
  excerpt: string;
  content?: string | null;
  date: string;
  readTime: string;
  tag: string;
  color: string;
  emoji: string;
  author_name: string;
}

export interface JobPostingOut {
  id: string;
  title: string;
  team: string;
  type: string;
  location: string;
  emoji: string;
  description?: string | null;
  requirements: string[];
  apply_email: string;
  is_active: boolean;
}

export interface ChallengeOut {
  id: string;
  title: string;
  desc: string;
  type: string;
  color: string;
  eta: string;
  xp_reward: number;
}

export interface LeaderboardEntryOut {
  rank: number;
  user_name: string;
  avatar_url?: string | null;
  language: string;
  xp: number;
}

export interface CertificationOut {
  id: string;
  title: string;
  desc: string;
  color: string;
  eta: string;
  levels: string[];
}

export interface CertificationVerifyResponse {
  valid: boolean;
  certificate_id: string;
  recipient_name?: string | null;
  certification_title?: string | null;
  language?: string | null;
  proficiency_level?: string | null;
  issue_date?: string | null;
  issuer: string;
}

/* ── APIs ── */
export const authAPI = {
  ssoExchange: async (code: string) => {
    const res = await authFetch("/auth/sso/exchange", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errorMessage(errData, "Failed to exchange SSO code");
      const err = new Error(msg);
      (err as any).status = res.status;
      throw err;
    }
    return res.json();
  },
  getMe: async () => {
    try {
      const res = await authFetch("/auth/me");
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },
};

export const courseAPI = {
  getLanguages: async () => {
    const res = await authFetch("/courses/languages");
    if (!res.ok) return [];
    return res.json();
  },
  getInstructors: async (language?: string) => {
    const url = language
      ? "/courses/instructors?language=" + encodeURIComponent(language)
      : "/courses/instructors";
    const res = await authFetch(url);
    if (!res.ok) return [];
    return res.json();
  },
  getAll: async (filters: any = "") => {
    if (typeof filters === "string") {
      return authFetch("/courses" + (filters ? "?" + filters : ""));
    }
    const params = new URLSearchParams();
    if (filters?.language) params.append("language", filters.language);
    if (filters?.instructor_id) params.append("instructor_id", filters.instructor_id);
    if (filters?.level) params.append("level", filters.level);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.featured !== undefined) params.append("featured", String(filters.featured));
    const queryString = params.toString() ? "?" + params.toString() : "";
    const res = await authFetch("/courses" + queryString);
    if (!res.ok) return [];
    return res.json();
  },
  getOne: async (courseId: string) => {
    const res = await authFetch("/courses/" + courseId);
    if (!res.ok) throw new Error("Course not found");
    return res.json();
  },
  getByLanguage: async (language: string) => {
    return authFetch("/courses?language=" + encodeURIComponent(language));
  },
  getInstructorCourses: async () => {
    return authFetch("/courses/instructor/mine");
  },
  getMyCourses: async () => {
    return authFetch("/enrollments/mine");
  },
  enroll: async (courseId: string) => {
    return authFetch("/enrollments/" + courseId + "/enroll", { method: "POST" });
  },
  create: async (body: object) => {
    return authFetch("/courses", { method: "POST", body: JSON.stringify(body) });
  },
  update: async (id: string, body: object) => {
    return authFetch("/courses/" + id, { method: "PUT", body: JSON.stringify(body) });
  },
  delete: async (id: string) => {
    return authFetch("/courses/" + id, { method: "DELETE" });
  },
};

export const enrollmentAPI = {
  enroll: async (courseId: string, demoBypass = false) => {
    const res = await authFetch(
      "/enrollments/" + courseId + "/enroll" + (demoBypass ? "?demo_bypass=true" : ""),
      { method: "POST" }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(errorMessage(err, "Enrollment failed"));
    }
    return res.json();
  },
  getMyCourses: async () => {
    const res = await authFetch("/enrollments/mine");
    if (!res.ok) return [];
    return res.json();
  },
  // Same as getMyCourses but throws on failure (for real error states)
  mine: () => getJSON<EnrollmentOut[]>("/enrollments/mine"),
  toggleLesson: async (courseId: string, lessonId: string) => {
    const res = await authFetch("/enrollments/" + courseId + "/lessons/" + lessonId + "/toggle", {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to update progress");
    return res.json();
  },
  getProgress: async (courseId: string) => {
    const res = await authFetch("/enrollments/" + courseId + "/progress");
    if (!res.ok) return null;
    return res.json();
  },
};

export const paymentsAPI = {
  createOrder: (courseId: string) =>
    getJSON<PaymentOrder>("/payments/create-order", {
      method: "POST",
      body: JSON.stringify({ course_id: courseId }),
    }),
  verifyPayment: (payment: PaymentVerificationRequest) =>
    getJSON<PaymentVerificationResponse>("/payments/verify-payment", {
      method: "POST",
      body: JSON.stringify(payment),
    }),
};

export const articleAPI = {
  list: (tag?: string) =>
    getJSON<ArticleOut[]>("/articles" + (tag ? "?tag=" + encodeURIComponent(tag) : "")),
  get: (slugOrId: string) => getJSON<ArticleOut>("/articles/" + encodeURIComponent(slugOrId)),
};

export const careerAPI = {
  jobs: () => getJSON<JobPostingOut[]>("/careers/jobs"),
};

export const challengeAPI = {
  list: () => getJSON<ChallengeOut[]>("/challenges"),
  leaderboard: () => getJSON<LeaderboardEntryOut[]>("/challenges/leaderboard"),
};

export const certificationAPI = {
  list: () => getJSON<CertificationOut[]>("/certifications"),
  verify: (certificateId: string) =>
    getJSON<CertificationVerifyResponse>("/certifications/verify/" + encodeURIComponent(certificateId)),
};

/* ── Learning catalog / player (matches live openapi.json) ── */
export interface LanguageSummary {
  language: string;
  course_count: number;
}

export interface InstructorPublic {
  id: string;
  full_name: string;
  avatar_url?: string | null;
}

export interface CourseResource {
  id: string;
  type: string;
  title: string;
  url: string;
  duration?: string | null;
  description?: string | null;
}

export interface CourseCard {
  id: string;
  title: string;
  description?: string | null;
  language: string;
  level: string;
  category: string;
  duration?: string | null;
  thumbnail_url?: string | null;
  price: string;
  tags: string[];
  resources: CourseResource[];
  instructor_id: string;
  instructor: InstructorPublic;
  status: string; // draft | pending_review | published | rejected | archived
  is_free: boolean;
  is_featured: boolean;
  modules_count: number;
  lessons_count: number;
  enrolled_count: number;
  // Approval workflow
  rejection_reason?: string | null;
  submitted_at?: string | null;
  managed_by_admin: boolean;
}

export interface LessonOut {
  id: string;
  module_id: string;
  title: string;
  description?: string | null;
  youtube_video_id?: string | null;
  notes_url?: string | null;
  order_index: number;
  is_preview: boolean;
  is_unlocked: boolean;
}

export interface ModuleOut {
  id: string;
  course_id: string;
  title: string;
  description?: string | null;
  order_index: number;
  lessons: LessonOut[];
}

export interface CourseDetail extends CourseCard {
  modules: ModuleOut[];
}

export interface CourseProgress {
  course_id: string;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
  completed_lesson_ids: string[];
  is_completed: boolean;
}

export interface LessonToggle {
  lesson_id: string;
  is_completed: boolean;
  completed_at?: string | null;
  course_progress_percentage: number;
  completed_lessons: number;
  total_lessons: number;
  is_course_completed: boolean;
}

export const learnAPI = {
  languages: () => getJSON<LanguageSummary[]>("/courses/languages"),
  courses: (f: { language?: string; instructor_id?: string; level?: string; category?: string; featured?: boolean } = {}) => {
    const p = new URLSearchParams();
    if (f.language) p.append("language", f.language);
    if (f.instructor_id) p.append("instructor_id", f.instructor_id);
    if (f.level) p.append("level", f.level);
    if (f.category) p.append("category", f.category);
    if (f.featured !== undefined) p.append("featured", String(f.featured));
    p.append("limit", "100");
    return getJSON<CourseCard[]>("/courses?" + p.toString());
  },
  course: (id: string) => getJSON<CourseDetail>("/courses/" + id),
  enroll: (id: string) => getJSON<EnrollmentOut>("/enrollments/" + id + "/enroll", { method: "POST" }),
  progress: (id: string) => getJSON<CourseProgress>("/enrollments/" + id + "/progress"),
  toggle: (courseId: string, lessonId: string) =>
    getJSON<LessonToggle>("/enrollments/" + courseId + "/lessons/" + lessonId + "/toggle", { method: "POST" }),
};

/* ── Instructor studio ── */
// The instructor's OWN profile (includes payout details; the bank account comes back masked)
export interface InstructorProfile {
  name: string;
  title: string;
  bio: string;
  languages: string[];
  experienceYears: number;
  avatarUrl?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  website?: string | null;
  upiId?: string | null;
  bankAccount?: string | null;
}

// Public instructor page: no payout details. 404 unless the instructor has a published course.
export interface InstructorPublicProfile {
  userId: string;
  name: string;
  title: string;
  bio: string;
  languages: string[];
  experienceYears: number;
  avatarUrl?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  website?: string | null;
}

export interface CourseInput {
  title: string;
  description?: string;
  language: string;
  level: string;
  category: string;
  duration?: string;
  price: number;
  tags: string[];
}

export interface LessonInput {
  title: string;
  description?: string;
  youtube_video_id?: string;
  notes_url?: string;
  order_index: number;
  is_preview: boolean;
}

export const instructorAPI = {
  myCourses: () => getJSON<CourseCard[]>("/courses/instructor/mine"),
  course: (id: string) => getJSON<CourseDetail>("/courses/" + id),

  // New courses are created as drafts. Going live needs submit() + admin approval.
  createCourse: (body: CourseInput) =>
    getJSON<CourseDetail>("/courses", send("POST", { ...body, isPublished: false, modules: 0 })),
  updateCourse: (id: string, body: Partial<CourseInput>) =>
    getJSON<CourseDetail>("/courses/" + id, send("PUT", body)),
  // Instructors can only move a course back to draft (withdraw / take offline)
  setStatus: (id: string, status: "draft") =>
    getJSON<CourseCard>("/courses/" + id + "/status", send("PATCH", { status })),
  submit: (id: string) => getJSON<CourseCard>("/courses/" + id + "/submit", send("POST")),
  deleteCourse: (id: string) => getJSON<void>("/courses/" + id, send("DELETE")),

  addModule: (courseId: string, body: { title: string; description?: string; order_index: number }) =>
    getJSON<ModuleOut>("/courses/" + courseId + "/modules", send("POST", body)),
  deleteModule: (moduleId: string) => getJSON<void>("/courses/modules/" + moduleId, send("DELETE")),

  addLesson: (moduleId: string, body: LessonInput) =>
    getJSON<LessonOut>("/courses/modules/" + moduleId + "/lessons", send("POST", body)),
  updateLesson: (lessonId: string, body: Partial<LessonInput>) =>
    getJSON<LessonOut>("/courses/lessons/" + lessonId, send("PUT", body)),
  deleteLesson: (lessonId: string) => getJSON<void>("/courses/lessons/" + lessonId, send("DELETE")),

  addResource: (
    courseId: string,
    body: { type: string; title: string; url: string; duration?: string; description?: string }
  ) => getJSON<CourseResource>("/courses/" + courseId + "/resources", send("POST", body)),
  deleteResource: (courseId: string, resourceId: string) =>
    getJSON<void>("/courses/" + courseId + "/resources/" + resourceId, send("DELETE")),

  // null = this instructor has no saved profile yet
  getProfile: async (): Promise<InstructorProfile | null> => {
    const res = await authFetch("/instructor/profile");
    if (res.status === 404) return null;
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(errorMessage(err, `Request failed (${res.status})`));
    }
    return res.json();
  },
  saveProfile: (body: Partial<InstructorProfile> & { name: string }) =>
    getJSON<InstructorProfile>("/instructor/profile", send("POST", body)),

  // Public page for any instructor. Throws (404) unless they have a published course.
  publicProfile: (userId: string) =>
    getJSON<InstructorPublicProfile>("/instructor/profile?user_id=" + encodeURIComponent(userId)),
};

/* ── Admin ──
   Roles are synced from the main VartaLang platform on every login, so there is no role/status
   editing here. Every /admin endpoint enforces admin access on the server. */
export interface AdminStats {
  total_users: number; // everyone who has logged in via SSO at least once
  new_users_7d: number;
  active_users_7d: number;
  active_users_30d: number;
  students: number;
  instructors: number;
  admins: number;
  courses_by_status: Record<string, number>; // draft | pending_review | published | rejected | archived
}

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  is_active: boolean;
  created_at: string;
  first_login_at: string | null;
  last_login_at: string | null;
  login_count: number;
}

export interface AdminCourse {
  id: string;
  title: string;
  language: string;
  level: string;
  status: string;
  enrolled_count: number;
  instructor_name: string | null;
  created_at: string;
  price: string | number;
  lessons_count: number;
  submitted_at: string | null;
  managed_by_admin: boolean;
}

export interface AdminInstructor {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
}

export interface AdminInstructorEnrollment {
  instructor_id: string;
  instructor_name: string;
  instructor_email: string;
  course_id: string;
  course_title: string;
  course_price: string | number;
  enrollment_count: number;
  paid_enrollment_count: number;
  total_paid_amount: string | number;
  currency: string;
}

export interface AdminEnrollmentPayment {
  id: string;
  status: string;
  amount: string | number;
  currency: string;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  created_at: string;
}

export interface AdminEnrollmentFinancial {
  enrollment_id: string;
  enrolled_at: string;
  completed_at?: string | null;
  enrollment_status: string;
  student_id: string;
  student_name: string;
  student_email: string;
  course_id: string;
  course_title: string;
  instructor_id: string;
  instructor_name: string;
  course_price: string | number;
  payments: AdminEnrollmentPayment[];
}

export interface AdminEnrollmentFinancialPage {
  items: AdminEnrollmentFinancial[];
  total?: number;
}

export const adminAPI = {
  stats: () => getJSON<AdminStats>("/admin/stats"),
  users: () => getJSON<AdminUser[]>("/admin/users"),
  courses: () => getJSON<AdminCourse[]>("/admin/courses"),
  instructors: () => getJSON<AdminInstructor[]>("/admin/instructors"),
  instructorEnrollments: (filters: { instructor_id?: string; course_id?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.instructor_id) params.set("instructor_id", filters.instructor_id);
    if (filters.course_id) params.set("course_id", filters.course_id);
    const query = params.toString();
    return getJSON<AdminInstructorEnrollment[]>("/admin/instructor-enrollments" + (query ? "?" + query : ""));
  },
  enrollmentFinancials: (
    filters: {
      instructor_id?: string;
      course_id?: string;
      enrollment_status?: string;
      search?: string;
      skip?: number;
      limit?: number;
    } = {}
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.set(key, String(value));
    });
    const query = params.toString();
    return getJSON<AdminEnrollmentFinancial[] | AdminEnrollmentFinancialPage>(
      "/admin/enrollment-financials" + (query ? "?" + query : "")
    ).then((response) =>
      Array.isArray(response) ? { items: response } : response
    );
  },
  deleteUser: (id: string) => getJSON<{ ok: boolean }>("/admin/users/" + id, send("DELETE")),
  deleteCourse: (id: string) => getJSON<{ archived: boolean }>("/admin/courses/" + id, send("DELETE")),

  // Approval workflow
  approveCourse: (id: string) => getJSON<unknown>("/admin/courses/" + id + "/approve", send("POST")),
  rejectCourse: (id: string, reason: string) =>
    getJSON<unknown>("/admin/courses/" + id + "/reject", send("POST", { reason })),
  unpublishCourse: (id: string) => getJSON<unknown>("/admin/courses/" + id + "/unpublish", send("POST")),
  // Admin can publish a draft / archived course directly (no review step)
  publishCourse: (id: string) =>
    getJSON<unknown>("/courses/" + id + "/status", send("PATCH", { status: "published" })),
  // Create a course on behalf of an instructor (admin-managed)
  createCourse: (body: CourseInput & { instructor_id: string; publish: boolean }) =>
    getJSON<CourseDetail>("/admin/courses", send("POST", { ...body, isPublished: body.publish })),
};

export default authFetch;