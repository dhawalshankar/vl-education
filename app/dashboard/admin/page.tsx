// app/dashboard/admin/page.tsx
"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Check,
  CheckCircle,
  Clock,
  EyeOff,
  GraduationCap,
  ListOrdered,
  LogIn,
  Pencil,
  Plus,
  Rocket,
  Trash2,
  UserPlus,
  Users,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CourseFormModal, CurriculumModal, StatusBadge, errBoxCls, errMsg, inputCls } from "@/components/CourseStudio";
import { useAuth } from "@/app/context/AuthContext";
import { adminAPI, instructorAPI } from "@/app/lib/api";
import type { AdminCourse, AdminUser, CourseCard } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";

type Tab = "overview" | "review" | "courses" | "users";

/* ── helpers ── */
const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const priceLabel = (p: string | number) => (Number(p) > 0 ? `₹${p}` : "Free");

const roleColor = (role: string) => {
  if (role === "admin") return "text-amber-400 bg-amber-400/10 border-amber-400/30";
  if (role === "instructor") return "text-sky-400 bg-sky-400/10 border-sky-400/30";
  return "text-stone-400 bg-stone-400/10 border-stone-600/30";
};

const levelColor = (level: string) => {
  if (level === "mastery") return "text-purple-400 bg-purple-400/10 border-purple-400/30";
  if (level === "professional") return "text-sky-400 bg-sky-400/10 border-sky-400/30";
  if (level === "intermediate") return "text-amber-400 bg-amber-400/10 border-amber-400/30";
  return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
};

const searchCls =
  "w-full max-w-sm bg-stone-900/60 border border-stone-700/50 rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all";

/* ── small components ── */
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  loading,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  loading: boolean;
}) {
  return (
    <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-700/50 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-stone-800/70 flex items-center justify-center shrink-0">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-3xl font-bold tabular-nums tracking-tight">{loading ? "–" : value}</p>
        <p className="text-xs text-stone-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-md border capitalize ${colorClass}`}>
      {label}
    </span>
  );
}

const TONES = {
  stone: "hover:text-amber-400 hover:bg-amber-400/10",
  green: "hover:text-emerald-400 hover:bg-emerald-400/10",
  red: "hover:text-red-400 hover:bg-red-400/10",
};

function IconBtn({
  title,
  onClick,
  disabled,
  tone = "stone",
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: keyof typeof TONES;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`p-2 text-stone-500 rounded-lg transition-all disabled:opacity-40 ${TONES[tone]}`}
    >
      {children}
    </button>
  );
}

/* ── reject dialog: a reason is required so the instructor knows what to fix ── */
function RejectModal({ course, onClose, onDone }: { course: AdminCourse; onClose: () => void; onDone: () => void }) {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const r = reason.trim();
    if (r.length < 5) return setError("Write a short reason so the instructor knows what to fix.");
    setSaving(true);
    setError(null);
    try {
      await adminAPI.rejectCourse(course.id, r);
      onDone();
    } catch (err) {
      setError(errMsg(err, "Could not reject the course."));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6">
      <form onSubmit={submit} className="bg-[#120F0C] border border-stone-700/80 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-kalam text-3xl font-bold">Request changes</h3>
            <p className="text-xs text-stone-500 mt-0.5">{course.title}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        {error && <div className={errBoxCls}>{error}</div>}
        <div>
          <label className="block text-xs text-stone-400 mb-1">What should the instructor fix? *</label>
          <textarea
            required
            rows={5}
            autoFocus
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Lesson 3 has no video, and the description does not say who the course is for."
            className={inputCls}
          />
          <p className="text-[11px] text-stone-500 mt-1">The instructor sees this on their course card and can resubmit after editing.</p>
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-500 text-white font-bold disabled:opacity-50"
          >
            {saving ? "Sending…" : "Reject course"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ═══════════════════════════ PAGE ═══════════════════════════ */
export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const allowed = !!user && !!isAdmin; // UX only; every /admin endpoint enforces admin on the server

  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [courseForm, setCourseForm] = useState<{ mode: "create" } | { mode: "edit"; course: CourseCard } | null>(null);
  const [curriculum, setCurriculum] = useState<{ id: string; readOnly: boolean; note?: string } | null>(null);
  const [rejecting, setRejecting] = useState<AdminCourse | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth/login");
    else if (!allowed) router.replace("/dashboard");
  }, [loading, user, allowed, router]);

  const stats = useApi(() => adminAPI.stats(), [reloadKey, user?.id], allowed);
  const usersQ = useApi(() => adminAPI.users(), [reloadKey, user?.id], allowed);
  const coursesQ = useApi(() => adminAPI.courses(), [reloadKey, user?.id], allowed);
  const instructorsQ = useApi(() => adminAPI.instructors(), [reloadKey, user?.id], allowed);

  const users: AdminUser[] = usersQ.data ?? [];
  const courses: AdminCourse[] = coursesQ.data ?? [];
  const s = stats.data;
  const byStatus = s?.courses_by_status ?? {};
  const totalCourses = Object.values(byStatus).reduce((a, n) => a + n, 0);

  const reload = () => setReloadKey((k) => k + 1);

  // Oldest submission first, so nobody waits forever
  const queue = useMemo(
    () =>
      courses
        .filter((c) => c.status === "pending_review")
        .sort((a, b) => +new Date(a.submitted_at ?? a.created_at) - +new Date(b.submitted_at ?? b.created_at)),
    [courses]
  );

  const recentUsers = useMemo(
    () => [...users].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 5),
    [users]
  );
  const recentCourses = useMemo(
    () => [...courses].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 5),
    [courses]
  );

  const q = search.trim().toLowerCase();
  const filteredUsers = users.filter(
    (u) => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );
  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.language.toLowerCase().includes(q) ||
      (c.instructor_name ?? "").toLowerCase().includes(q)
  );

  /* ── actions ── */
  // fn returns the success text
  const act = async (id: string, fn: () => Promise<string>, fallback: string) => {
    setBusyId(id);
    setMessage(null);
    try {
      setMessage({ type: "success", text: await fn() });
      reload();
    } catch (e) {
      setMessage({ type: "error", text: errMsg(e, fallback) });
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = (u: AdminUser) => {
    if (
      !confirm(
        `Delete ${u.full_name} (${u.email})?\n\nTheir LMS account will be deactivated and they will not be able to log in again. Payment records are kept.`
      )
    )
      return;
    return act(
      u.id,
      async () => {
        await adminAPI.deleteUser(u.id);
        return "User deleted.";
      },
      "Failed to delete user."
    );
  };

  const deleteCourse = (c: AdminCourse) => {
    const note =
      c.enrolled_count > 0
        ? `\n\n${c.enrolled_count} student(s) are enrolled. The course will be archived and hidden; sales records are kept.`
        : "";
    if (!confirm(`Delete "${c.title}"?${note}`)) return;
    return act(
      c.id,
      async () => {
        const res = await adminAPI.deleteCourse(c.id);
        return res?.archived ? "Course archived." : "Course deleted.";
      },
      "Failed to delete course."
    );
  };

  const approve = (c: AdminCourse) =>
    act(
      c.id,
      async () => {
        await adminAPI.approveCourse(c.id);
        return `"${c.title}" is now live.`;
      },
      "Could not approve the course."
    );

  // Draft / archived courses have no approval step: the admin publishes them directly
  const publish = (c: AdminCourse) =>
    act(
      c.id,
      async () => {
        await adminAPI.publishCourse(c.id);
        return `"${c.title}" is now live.`;
      },
      "Could not publish the course."
    );

  const unpublish = (c: AdminCourse) => {
    if (!confirm(`Take "${c.title}" offline? Enrolled students will lose access until it is published again.`)) return;
    return act(
      c.id,
      async () => {
        await adminAPI.unpublishCourse(c.id);
        return `"${c.title}" was taken offline.`;
      },
      "Could not unpublish the course."
    );
  };

  const openEdit = async (c: AdminCourse) => {
    setBusyId(c.id);
    setMessage(null);
    try {
      setCourseForm({ mode: "edit", course: await instructorAPI.course(c.id) });
    } catch (e) {
      setMessage({ type: "error", text: errMsg(e, "Could not load the course.") });
    } finally {
      setBusyId(null);
    }
  };

  if (loading || !allowed) {
    return (
      <div className="min-h-screen bg-[#0a0908]/90 flex items-center justify-center">
        <div className="text-amber-400 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "review", label: `Review queue (${queue.length})` },
    { id: "courses", label: `Courses (${courses.length})` },
    { id: "users", label: `Users (${users.length})` },
  ];

  const cards: { label: string; value: number; icon: LucideIcon; color: string }[] = [
    { label: "Users (logged in via SSO)", value: s?.total_users ?? 0, icon: LogIn, color: "text-amber-400" },
    { label: "Active, last 7 days", value: s?.active_users_7d ?? 0, icon: Activity, color: "text-emerald-400" },
    { label: "Active, last 30 days", value: s?.active_users_30d ?? 0, icon: Activity, color: "text-teal-400" },
    { label: "New, last 7 days", value: s?.new_users_7d ?? 0, icon: UserPlus, color: "text-sky-400" },
    { label: "Students", value: s?.students ?? 0, icon: GraduationCap, color: "text-emerald-400" },
    { label: "Instructors", value: s?.instructors ?? 0, icon: Users, color: "text-purple-400" },
    { label: "Live courses", value: byStatus.published ?? 0, icon: CheckCircle, color: "text-emerald-400" },
    { label: "Awaiting review", value: byStatus.pending_review ?? 0, icon: Clock, color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0e0c0a] text-white relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-35 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=85')`,
          filter: "contrast(110%) brightness(75%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 20%, rgba(255, 85, 0, 0.12), transparent 70%),
            linear-gradient(180deg, rgba(14, 12, 10, 0.55) 0%, rgba(14, 12, 10, 0.78) 55%, #0e0c0a 100%)
          `,
        }}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-36 pb-20 w-full">
        <div className="mb-8">
          <h1 className="font-kalam text-4xl sm:text-5xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-stone-400 text-sm mt-1">Review courses, manage users, and monitor logins.</p>
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

        {/* Tab nav */}
        <div className="flex items-center gap-1 mb-8 bg-stone-900/60 border border-stone-700/50 rounded-xl p-1 w-fit max-w-full overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setSearch("");
              }}
              className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                tab === t.id
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/20"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-8">
            {stats.error && <div className={errBoxCls}>Could not load stats: {stats.error}</div>}

            {queue.length > 0 && (
              <div className="px-5 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-4">
                <p className="text-sm text-amber-200">
                  {queue.length} course{queue.length === 1 ? " is" : "s are"} waiting for your review.
                </p>
                <button
                  onClick={() => setTab("review")}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shrink-0"
                >
                  Open review queue
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {cards.map((c) => (
                <StatCard key={c.label} {...c} loading={stats.loading} />
              ))}
            </div>
            <p className="text-xs text-stone-600 -mt-4">
              {totalCourses} course{totalCourses === 1 ? "" : "s"} in total. &quot;Users&quot; counts everyone who has
              logged in to the LMS through SSO at least once.
            </p>

            {/* Recent users */}
            <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-800/60 flex items-center justify-between">
                <h2 className="font-semibold">Recent users</h2>
                <button onClick={() => setTab("users")} className="text-xs text-amber-400 hover:text-amber-300">
                  View all →
                </button>
              </div>
              <div className="divide-y divide-stone-800/40">
                {recentUsers.map((u) => (
                  <div key={u.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-600/30 border border-amber-500/20 flex items-center justify-center text-amber-300 font-bold text-sm shrink-0">
                        {u.full_name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{u.full_name}</p>
                        <p className="text-xs text-stone-500 truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge label={u.role} colorClass={roleColor(u.role)} />
                      <span className="text-xs text-stone-600 hidden sm:block">{fmt(u.created_at)}</span>
                    </div>
                  </div>
                ))}
                {!usersQ.loading && users.length === 0 && (
                  <p className="text-center py-8 text-stone-600 text-sm">No users yet</p>
                )}
              </div>
            </div>

            {/* Recent courses */}
            <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-800/60 flex items-center justify-between">
                <h2 className="font-semibold">Recent courses</h2>
                <button onClick={() => setTab("courses")} className="text-xs text-amber-400 hover:text-amber-300">
                  View all →
                </button>
              </div>
              <div className="divide-y divide-stone-800/40">
                {recentCourses.map((c) => (
                  <div key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{c.title}</p>
                      <p className="text-xs text-stone-500 mt-0.5 truncate">
                        {c.instructor_name ?? "—"} · {c.language}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge label={c.level} colorClass={levelColor(c.level)} />
                      <StatusBadge status={c.status} />
                      <span className="text-xs text-stone-600 hidden sm:block">{c.enrolled_count} enrolled</span>
                    </div>
                  </div>
                ))}
                {!coursesQ.loading && courses.length === 0 && (
                  <p className="text-center py-8 text-stone-600 text-sm">No courses yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── REVIEW QUEUE ── */}
        {tab === "review" && (
          <div className="space-y-4">
            {coursesQ.error && <div className={errBoxCls}>Could not load courses: {coursesQ.error}</div>}
            <p className="text-xs text-stone-500">Oldest submissions first. Preview the curriculum before you approve.</p>

            {coursesQ.loading ? (
              <p className="text-center py-12 text-stone-600 text-sm">Loading queue…</p>
            ) : queue.length === 0 ? (
              <div className="p-14 rounded-2xl bg-stone-900/40 border border-stone-800 text-center">
                <CheckCircle className="w-9 h-9 mx-auto mb-3 text-emerald-400/50" />
                <p className="font-semibold">Nothing to review</p>
                <p className="text-sm text-stone-500 mt-1">New submissions from instructors show up here.</p>
              </div>
            ) : (
              queue.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-stone-900/60 border border-stone-700/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{c.title}</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {c.instructor_name ?? "—"} · {c.language}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px]">
                      <Badge label={c.level} colorClass={levelColor(c.level)} />
                      <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300">{priceLabel(c.price)}</span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300">
                        {c.lessons_count} lesson{c.lessons_count === 1 ? "" : "s"}
                      </span>
                      <span className="text-stone-500">Submitted {fmt(c.submitted_at ?? c.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        setCurriculum({ id: c.id, readOnly: true, note: "Approve or reject from the review queue." })
                      }
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2"
                    >
                      <ListOrdered className="w-4 h-4" /> Preview curriculum
                    </button>
                    <button
                      onClick={() => setRejecting(c)}
                      disabled={busyId === c.id}
                      className="px-4 py-2 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-500/10 text-xs font-semibold disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approve(c)}
                      disabled={busyId === c.id}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold disabled:opacity-50"
                    >
                      {busyId === c.id ? "Working…" : "Approve & publish"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── COURSES ── */}
        {tab === "courses" && (
          <div className="space-y-4">
            {coursesQ.error && <div className={errBoxCls}>Could not load courses: {coursesQ.error}</div>}
            {instructorsQ.error && <div className={errBoxCls}>Could not load instructors: {instructorsQ.error}</div>}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Search by title, language or instructor…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={searchCls}
              />
              <button
                onClick={() => setCourseForm({ mode: "create" })}
                disabled={instructorsQ.loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-xs flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> New course for an instructor
              </button>
            </div>

            <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-800/60 bg-stone-950/30">
                <span className="col-span-3">Course</span>
                <span className="col-span-2">Status</span>
                <span className="col-span-1">Price</span>
                <span className="col-span-1 text-center">Lessons</span>
                <span className="col-span-1 text-center">Enrolled</span>
                <span className="col-span-4 text-right">Actions</span>
              </div>
              <div className="divide-y divide-stone-800/40">
                {coursesQ.loading ? (
                  <p className="text-center py-12 text-stone-600 text-sm">Loading courses…</p>
                ) : filteredCourses.length === 0 ? (
                  <p className="text-center py-12 text-stone-600 text-sm">No courses found</p>
                ) : (
                  filteredCourses.map((c) => {
                    const busy = busyId === c.id;
                    return (
                      <div key={c.id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-white/5 transition-colors gap-y-2">
                        <div className="col-span-12 sm:col-span-3 min-w-0 pr-3">
                          <p className="text-sm font-medium truncate">{c.title}</p>
                          <p className="text-xs text-stone-500 mt-0.5 truncate">
                            {c.instructor_name ?? "—"} · {c.language}
                            {c.managed_by_admin ? " · admin-managed" : ""}
                          </p>
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                          <StatusBadge status={c.status} />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-xs text-stone-400">{priceLabel(c.price)}</span>
                        </div>
                        <div className="col-span-3 sm:col-span-1 sm:text-center">
                          <span className="text-xs text-stone-400">{c.lessons_count}</span>
                        </div>
                        <div className="col-span-3 sm:col-span-1 sm:text-center">
                          <span className="text-xs font-semibold text-amber-400">{c.enrolled_count}</span>
                        </div>
                        <div className="col-span-12 sm:col-span-4 flex justify-end gap-0.5">
                          {c.status === "pending_review" && (
                            <IconBtn title="Approve & publish" tone="green" disabled={busy} onClick={() => approve(c)}>
                              <Check className="w-4 h-4" />
                            </IconBtn>
                          )}
                          {c.status === "pending_review" && (
                            <IconBtn title="Reject" tone="red" disabled={busy} onClick={() => setRejecting(c)}>
                              <XCircle className="w-4 h-4" />
                            </IconBtn>
                          )}
                          {(c.status === "draft" || c.status === "archived") && (
                            <IconBtn title="Publish now" tone="green" disabled={busy} onClick={() => publish(c)}>
                              <Rocket className="w-4 h-4" />
                            </IconBtn>
                          )}
                          {c.status === "published" && (
                            <IconBtn title="Unpublish" disabled={busy} onClick={() => unpublish(c)}>
                              <EyeOff className="w-4 h-4" />
                            </IconBtn>
                          )}
                          <IconBtn title="Curriculum & materials" onClick={() => setCurriculum({ id: c.id, readOnly: false })}>
                            <ListOrdered className="w-4 h-4" />
                          </IconBtn>
                          <IconBtn title="Edit details" disabled={busy} onClick={() => openEdit(c)}>
                            <Pencil className="w-4 h-4" />
                          </IconBtn>
                          <IconBtn title="Delete course" tone="red" disabled={busy} onClick={() => deleteCourse(c)}>
                            <Trash2 className="w-4 h-4" />
                          </IconBtn>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === "users" && (
          <div className="space-y-4">
            {usersQ.error && <div className={errBoxCls}>Could not load users: {usersQ.error}</div>}
            <input
              type="text"
              placeholder="Search users by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={searchCls}
            />
            <p className="text-xs text-stone-600">Roles are synced from VartaLang on every login and cannot be changed here.</p>

            <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-800/60 bg-stone-950/30">
                <span className="col-span-4">User</span>
                <span className="col-span-2">Role</span>
                <span className="col-span-2">Joined</span>
                <span className="col-span-3">Last login</span>
                <span className="col-span-1 text-right">Del</span>
              </div>
              <div className="divide-y divide-stone-800/40">
                {usersQ.loading ? (
                  <p className="text-center py-12 text-stone-600 text-sm">Loading users…</p>
                ) : filteredUsers.length === 0 ? (
                  <p className="text-center py-12 text-stone-600 text-sm">No users found</p>
                ) : (
                  filteredUsers.map((u) => {
                    const canDelete = u.role !== "admin" && u.id !== user?.id;
                    return (
                      <div key={u.id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-white/5 transition-colors gap-y-2">
                        <div className="col-span-12 sm:col-span-4 flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/15 flex items-center justify-center text-amber-300 font-bold text-sm shrink-0">
                            {u.full_name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{u.full_name}</p>
                            <p className="text-xs text-stone-500 truncate">{u.email}</p>
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                          <Badge label={u.role} colorClass={roleColor(u.role)} />
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                          <span className="text-xs text-stone-500">{fmt(u.created_at)}</span>
                        </div>
                        <div className="col-span-4 sm:col-span-3">
                          <p className="text-xs text-stone-400">{fmt(u.last_login_at)}</p>
                          <p className="text-[11px] text-stone-600">
                            {u.login_count ?? 0} login{u.login_count === 1 ? "" : "s"}
                          </p>
                        </div>
                        <div className="col-span-12 sm:col-span-1 flex justify-end">
                          {canDelete && (
                            <IconBtn title="Delete user" tone="red" disabled={busyId === u.id} onClick={() => deleteUser(u)}>
                              <Trash2 className="w-4 h-4" />
                            </IconBtn>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {courseForm && (
        <CourseFormModal
          key={courseForm.mode === "edit" ? courseForm.course.id : "new"}
          state={courseForm}
          instructors={instructorsQ.data ?? []}
          onClose={() => setCourseForm(null)}
          onSaved={(info) => {
            setCourseForm(null);
            setMessage({
              type: "success",
              text: info.created
                ? info.published
                  ? "Course created and published. Add modules and lessons next."
                  : "Course created as a draft. Add modules and lessons, then publish it."
                : "Course updated.",
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

      {rejecting && (
        <RejectModal
          course={rejecting}
          onClose={() => setRejecting(null)}
          onDone={() => {
            setMessage({ type: "success", text: `"${rejecting.title}" was sent back to the instructor.` });
            setRejecting(null);
            reload();
          }}
        />
      )}

      <Footer />
    </div>
  );
}