// app/dashboard/instructor/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Clock,
  ExternalLink,
  Layers,
  ListOrdered,
  Lock,
  Pencil,
  Plus,
  Save,
  Send,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CourseFormModal, CurriculumModal, StatusBadge, errBoxCls, errMsg, inputCls } from "@/components/CourseStudio";
import { useAuth } from "@/app/context/AuthContext";
import { CourseCard, InstructorProfile, instructorAPI } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";
import { slugify } from "@/app/lib/languages";

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

// Published and in-review courses cannot be edited by the instructor (server returns 409).
// Admin-managed and archived courses are view-only.
const lockReason = (c: CourseCard): string | null => {
  if (c.managed_by_admin) return "This course is managed by an admin, so you can view it but not change it.";
  if (c.status === "published") return "This course is live. Move it to draft to edit it.";
  if (c.status === "pending_review") return "This course is in review. Withdraw it to edit it.";
  if (c.status === "archived") return "This course was archived by an admin.";
  return null;
};

/* ═══════════════════════════ PAGE ═══════════════════════════ */
export default function InstructorStudioPage() {
  const { user, loading, isInstructor, isAdmin } = useAuth();
  const router = useRouter();
  const allowed = !!user && (isInstructor || isAdmin); // UX only; the server enforces roles

  const [tab, setTab] = useState<"courses" | "profile">("courses");
  const [reloadKey, setReloadKey] = useState(0);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [courseForm, setCourseForm] = useState<{ mode: "create" } | { mode: "edit"; course: CourseCard } | null>(null);
  const [curriculum, setCurriculum] = useState<{ id: string; readOnly: boolean; note?: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth/login");
    else if (!allowed) router.replace("/dashboard");
  }, [loading, user, allowed, router]);

  const courses = useApi(() => instructorAPI.myCourses(), [reloadKey, user?.id], allowed);
  const list = courses.data ?? [];
  const live = list.filter((c) => c.status === "published").length;
  const inReview = list.filter((c) => c.status === "pending_review").length;
  const drafts = list.filter((c) => c.status === "draft" || c.status === "rejected").length;
  const totalEnrolled = list.reduce((a, c) => a + (c.enrolled_count || 0), 0);

  const reload = () => setReloadKey((k) => k + 1);

  const act = async (c: CourseCard, fn: () => Promise<unknown>, successText: string) => {
    setBusyId(c.id);
    setMessage(null);
    try {
      await fn();
      setMessage({ type: "success", text: successText });
      reload();
    } catch (e) {
      setMessage({ type: "error", text: errMsg(e) });
    } finally {
      setBusyId(null);
    }
  };

  const submitForReview = (c: CourseCard) =>
    act(c, () => instructorAPI.submit(c.id), "Submitted for review. It goes live once an admin approves it.");

  const moveToDraft = (c: CourseCard) => {
    if (c.status === "published" && !confirm(`Take "${c.title}" offline? It will need admin approval again to go live.`)) return;
    return act(
      c,
      () => instructorAPI.setStatus(c.id, "draft"),
      c.status === "pending_review" ? "Submission withdrawn. The course is a draft again." : "Course moved to drafts."
    );
  };

  const deleteCourse = (c: CourseCard) => {
    if (!confirm(`Delete "${c.title}" and all its modules and lessons? This cannot be undone.`)) return;
    return act(c, () => instructorAPI.deleteCourse(c.id), "Course deleted.");
  };

  if (loading || !allowed) {
    return (
      <div className="min-h-screen bg-[#0a0908]/90 flex items-center justify-center">
        <div className="text-amber-400 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const metrics = [
    { label: "Courses live", value: live, icon: CheckCircle, color: "text-emerald-400" },
    { label: "In review", value: inReview, icon: Clock, color: "text-amber-400" },
    { label: "Drafts", value: drafts, icon: Layers, color: "text-stone-400" },
    { label: "Total enrollments", value: totalEnrolled, icon: Users, color: "text-sky-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0908]/90 text-white relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0908]/80 via-[#0a0908]/90 to-[#0a0908] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-36 pb-20 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="font-kalam text-4xl sm:text-5xl font-bold tracking-tight">
              {user?.full_name ? `${user.full_name.split(" ")[0]}'s Studio` : "Instructor Studio"}
            </h1>
            <p className="text-stone-400 text-sm mt-1">
              Create courses, build the curriculum, then submit for review. An admin approves it before it goes live.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700/80 hover:bg-stone-800 text-stone-300 text-xs font-semibold"
            >
              My Learning
            </Link>
            <button
              onClick={() => setCourseForm({ mode: "create" })}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New course
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`mb-8 px-5 py-3 rounded-xl text-sm flex items-center justify-between ${
              message.type === "error"
                ? "bg-red-500/15 border border-red-500/30 text-red-300"
                : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-stone-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-stone-800/70 flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <div>
                  <p className="font-kalam text-3xl font-bold tabular-nums">{courses.loading ? "–" : m.value}</p>
                  <p className="text-xs text-stone-500">{m.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 border-b border-stone-800 pb-4 mb-8">
          {(
            [
              ["courses", "My courses", BookOpen],
              ["profile", "Public profile", User],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                tab === key
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-stone-400 hover:text-white hover:bg-stone-900"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {tab === "courses" && (
          <>
            {courses.error && <div className={`mb-6 ${errBoxCls}`}>Could not load your courses: {courses.error}</div>}

            {courses.loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                ))}
              </div>
            ) : list.length === 0 && !courses.error ? (
              <div className="p-16 rounded-3xl bg-stone-900/40 border border-stone-800 text-center max-w-xl mx-auto">
                <BookOpen className="w-10 h-10 mx-auto mb-4 text-amber-400/50" />
                <h3 className="font-kalam text-2xl font-bold mb-2">No courses yet</h3>
                <p className="text-sm text-stone-400 mb-6">
                  Create a course, then add modules and lessons with YouTube videos and notes.
                </p>
                <button
                  onClick={() => setCourseForm({ mode: "create" })}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-bold text-sm"
                >
                  Create your first course
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((c) => {
                  const locked = lockReason(c);
                  const busy = busyId === c.id;
                  const canSubmit = !c.managed_by_admin && (c.status === "draft" || c.status === "rejected");
                  const canDelete = canSubmit; // server also blocks courses that have students or payments
                  return (
                    <div
                      key={c.id}
                      className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 flex flex-col justify-between transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={c.status} />
                            {c.managed_by_admin && (
                              <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 whitespace-nowrap">
                                Managed by admin
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setCourseForm({ mode: "edit", course: c })}
                              disabled={!!locked}
                              title={locked ?? "Edit details"}
                              className="p-2 rounded-lg bg-stone-800/80 hover:bg-amber-500/20 text-stone-400 hover:text-amber-400 disabled:opacity-40 disabled:hover:bg-stone-800/80 disabled:hover:text-stone-400"
                            >
                              {locked ? <Lock className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                            </button>
                            {canDelete && (
                              <button
                                onClick={() => deleteCourse(c)}
                                disabled={busy}
                                title="Delete course"
                                className="p-2 rounded-lg bg-stone-800/80 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 disabled:opacity-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <h3 className="font-kalam text-2xl font-bold mb-2 leading-snug">{c.title}</h3>
                        <p className="text-xs text-stone-400 line-clamp-2 mb-4">{c.description}</p>

                        {c.status === "rejected" && (
                          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 mb-4">
                            <p className="font-semibold mb-1 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" /> Changes requested
                            </p>
                            <p className="whitespace-pre-line text-red-200/90">{c.rejection_reason || "No reason was given."}</p>
                          </div>
                        )}
                        {c.status === "pending_review" && (
                          <p className="text-xs text-amber-300/90 mb-4">
                            {c.submitted_at ? `Submitted ${fmtDate(c.submitted_at)}. ` : ""}Waiting for admin review.
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300">{c.language}</span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 capitalize">{c.level}</span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-bold">
                            {c.is_free ? "Free" : `₹${c.price}`}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 mb-5 space-y-1.5 text-xs text-stone-400">
                          <div className="flex justify-between">
                            <span>Modules / lessons</span>
                            <span className="font-semibold text-white">
                              {c.modules_count} / {c.lessons_count}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Students enrolled</span>
                            <span className="font-semibold text-amber-300">{c.enrolled_count}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-stone-800/80 space-y-3">
                        <button
                          onClick={() => setCurriculum({ id: c.id, readOnly: !!locked, note: locked ?? undefined })}
                          className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2"
                        >
                          <ListOrdered className="w-4 h-4" /> {locked ? "View curriculum" : "Curriculum & materials"}
                        </button>
                        <div className="flex items-center justify-between gap-2">
                          {canSubmit ? (
                            <button
                              onClick={() => submitForReview(c)}
                              disabled={busy || c.lessons_count === 0}
                              title={c.lessons_count === 0 ? "Add at least one lesson before submitting" : ""}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-40 flex items-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" /> {c.status === "rejected" ? "Resubmit for review" : "Submit for review"}
                            </button>
                          ) : !c.managed_by_admin && c.status === "pending_review" ? (
                            <button
                              onClick={() => moveToDraft(c)}
                              disabled={busy}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500 disabled:opacity-40"
                            >
                              Withdraw
                            </button>
                          ) : !c.managed_by_admin && c.status === "published" ? (
                            <button
                              onClick={() => moveToDraft(c)}
                              disabled={busy}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-700 text-stone-400 hover:text-rose-400 hover:border-rose-500/40 disabled:opacity-40"
                            >
                              Move to draft
                            </button>
                          ) : (
                            <span className="text-[11px] text-stone-600">View only</span>
                          )}
                          <Link
                            href={`/learn/${slugify(c.language)}/${c.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
                          >
                            Preview <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {tab === "profile" && <ProfileTab onMessage={setMessage} />}
      </main>

      {courseForm && (
        <CourseFormModal
          key={courseForm.mode === "edit" ? courseForm.course.id : "new"}
          state={courseForm}
          onClose={() => setCourseForm(null)}
          onSaved={(info) => {
            setCourseForm(null);
            setMessage({
              type: "success",
              text: info.created ? "Draft created. Add modules and lessons, then submit it for review." : "Course updated.",
            });
            reload();
            if (info.created) setCurriculum({ id: info.id, readOnly: false });
          }}
        />
      )}

      {curriculum && (
        <CurriculumModal
          courseId={curriculum.id}
          readOnly={curriculum.readOnly}
          readOnlyNote={curriculum.note}
          onClose={() => setCurriculum(null)}
          onChanged={reload}
        />
      )}

      <Footer />
    </div>
  );
}

/* ═══════════════════ PROFILE ═══════════════════ */
type ProfileForm = {
  name: string;
  title: string;
  bio: string;
  languages: string; // comma separated in the UI
  experienceYears: number;
  avatarUrl: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  website: string;
  upiId: string;
  bankAccount: string;
};

const EMPTY_PROFILE: ProfileForm = {
  name: "",
  title: "",
  bio: "",
  languages: "",
  experienceYears: 0,
  avatarUrl: "",
  twitter: "",
  linkedin: "",
  youtube: "",
  website: "",
  upiId: "",
  bankAccount: "",
};

const toForm = (p: InstructorProfile): ProfileForm => ({
  name: p.name ?? "",
  title: p.title ?? "",
  bio: p.bio ?? "",
  languages: (p.languages ?? []).join(", "),
  experienceYears: p.experienceYears ?? 0,
  avatarUrl: p.avatarUrl ?? "",
  twitter: p.twitter ?? "",
  linkedin: p.linkedin ?? "",
  youtube: p.youtube ?? "",
  website: p.website ?? "",
  upiId: p.upiId ?? "",
  bankAccount: p.bankAccount ?? "",
});

function ProfileTab({ onMessage }: { onMessage: (message: { type: "error" | "success"; text: string }) => void }) {
  const [form, setForm] = useState<ProfileForm>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    instructorAPI
      .getProfile()
      .then((p) => {
        if (alive && p) setForm(toForm(p));
      })
      .catch((e) => alive && setError(errMsg(e, "Could not load your profile.")))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const set = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.name.trim().length < 2) return setError("Name must be at least 2 characters.");
    setSaving(true);
    try {
      const saved = await instructorAPI.saveProfile({
        name: form.name.trim(),
        title: form.title.trim() || "Language Educator & Linguistic Mentor",
        bio: form.bio.trim(),
        languages: form.languages.split(",").map((l) => l.trim()).filter(Boolean),
        experienceYears: Math.max(0, Math.floor(form.experienceYears) || 0),
        avatarUrl: form.avatarUrl.trim(),
        twitter: form.twitter.trim(),
        linkedin: form.linkedin.trim(),
        youtube: form.youtube.trim(),
        website: form.website.trim(),
        upiId: form.upiId.trim(),
        bankAccount: form.bankAccount.trim(),
      });
      setForm(toForm(saved));
      onMessage({ type: "success", text: "Profile updated." });
    } catch (err) {
      setError(errMsg(err, "Could not save your profile."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-64 max-w-2xl rounded-2xl bg-white/5 border border-white/10 animate-pulse" />;

  const field = (label: string, key: keyof ProfileForm, placeholder = "") => (
    <div>
      <label className="block text-xs text-stone-400 mb-1">{label}</label>
      <input
        value={String(form[key])}
        onChange={(e) => set(key, e.target.value as never)}
        placeholder={placeholder}
        className={inputCls}
      />
    </div>
  );

  return (
    <form onSubmit={save} className="max-w-2xl p-6 sm:p-8 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-5">
      <div>
        <h2 className="font-kalam text-3xl font-bold">Public profile</h2>
        <p className="text-sm text-stone-400 mt-1">Tell learners a little about you.</p>
      </div>
      {error && <div className={errBoxCls}>{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field("Full name *", "name", "Your name")}
        {field("Headline", "title", "Language Educator & Linguistic Mentor")}
      </div>

      <div>
        <label className="block text-xs text-stone-400 mb-1">Bio</label>
        <textarea
          rows={5}
          maxLength={2000}
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          className={inputCls}
          placeholder="Share your teaching experience and interests."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field("Languages (comma separated)", "languages", "Hindi, English")}
        <div>
          <label className="block text-xs text-stone-400 mb-1">Years of experience</label>
          <input
            type="number"
            min={0}
            value={form.experienceYears}
            onChange={(e) => set("experienceYears", Number(e.target.value))}
            className={`${inputCls} font-mono`}
          />
        </div>
      </div>

      {field("Avatar URL", "avatarUrl", "https://...")}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field("Website", "website", "https://...")}
        {field("YouTube", "youtube", "https://youtube.com/@...")}
        {field("LinkedIn", "linkedin", "https://linkedin.com/in/...")}
        {field("X / Twitter", "twitter", "https://x.com/...")}
      </div>

      <div className="pt-4 border-t border-stone-800 space-y-3">
        <p className="text-xs text-stone-500">Payout details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {field("UPI ID", "upiId", "name@bank")}
          {field("Bank account", "bankAccount", "IFSC + account number")}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold disabled:opacity-50 flex items-center gap-2"
      >
        <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}