// app/learn/[language]/[courseId]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle, Circle, ExternalLink, Lock, Play, UserCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { enrollmentAPI, learnAPI, LessonOut } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";
import RazorpayCheckout from "@/components/RazorpayCheckout";
import Footer from "@/components/Footer";

const byOrder = (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index;

// Only http(s) links are rendered (teacher-provided URLs are untrusted)
const safeUrl = (u?: string | null) => (u && /^https?:\/\//i.test(u) ? u : null);

// Accepts a bare YouTube id or a full YouTube URL
function toYouTubeEmbed(value?: string | null): string | null {
  if (!value) return null;
  const v = value.trim();
  if (/^[\w-]{11}$/.test(v)) return `https://www.youtube.com/embed/${v}`;
  try {
    const u = new URL(v);
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return v;
    }
  } catch {}
  return null;
}

export default function CourseViewer() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const language = String(params?.language ?? "");
  const courseId = String(params?.courseId ?? "");

  const [reloadKey, setReloadKey] = useState(0);
  const course = useApi(() => learnAPI.course(courseId), [courseId, reloadKey], isAuthenticated);
  const mine = useApi(() => enrollmentAPI.mine(), [reloadKey], isAuthenticated);
  const enrolled = (mine.data ?? []).some((e) => e.course_id === courseId);

  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<{ pct: number; done: number; total: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace("/auth/login");
  }, [authLoading, isAuthenticated, router]);

  // Progress comes only from the server
  useEffect(() => {
    if (!enrolled) {
      setCompleted(new Set());
      setStats(null);
      return;
    }
    let alive = true;
    learnAPI
      .progress(courseId)
      .then((p) => {
        if (!alive) return;
        setCompleted(new Set(p.completed_lesson_ids));
        setStats({ pct: p.progress_percentage, done: p.completed_lessons, total: p.total_lessons });
      })
      .catch((e) => alive && setActionError(e instanceof Error ? e.message : "Could not load progress"));
    return () => {
      alive = false;
    };
  }, [enrolled, courseId, reloadKey]);

  const modules = useMemo(
    () =>
      [...(course.data?.modules ?? [])]
        .sort(byOrder)
        .map((m) => ({ ...m, lessons: [...m.lessons].sort(byOrder) })),
    [course.data]
  );
  const allLessons = useMemo(() => modules.flatMap((m) => m.lessons), [modules]);
  const selected: LessonOut | null =
    allLessons.find((l) => l.id === selectedId) ?? allLessons.find((l) => l.is_unlocked) ?? allLessons[0] ?? null;

  const handleEnroll = async () => {
    setBusy(true);
    setActionError(null);
    setSuccessMessage(null);
    try {
      await learnAPI.enroll(courseId);
      setReloadKey((k) => k + 1); // refetch: locked lessons now come unmasked
      setSuccessMessage("You are enrolled in this course.");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Enrollment failed");
    } finally {
      setBusy(false);
    }
  };

  const handlePaidSuccess = () => {
    setReloadKey((k) => k + 1);
    setSuccessMessage("Payment verified. You are enrolled in this course.");
  };

  const handleToggle = async (lesson: LessonOut) => {
    setBusy(true);
    setActionError(null);
    try {
      const r = await learnAPI.toggle(courseId, lesson.id);
      setCompleted((prev) => {
        const next = new Set(prev);
        if (r.is_completed) next.add(r.lesson_id);
        else next.delete(r.lesson_id);
        return next;
      });
      setStats({ pct: r.course_progress_percentage, done: r.completed_lessons, total: r.total_lessons });
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Could not update progress");
    } finally {
      setBusy(false);
    }
  };

  if (authLoading || (course.loading && !course.data)) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="text-amber-400 text-2xl animate-pulse">Loading course…</div>
      </div>
    );
  }

  if (course.error || !course.data) {
    return (
      <div className="min-h-screen bg-[#0a0908] text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <BookOpen className="w-12 h-12 text-stone-600" />
        <h2 className="text-2xl font-bold">Could not load this course</h2>
        <p className="text-stone-400 text-sm">{course.error ?? "Course not found"}</p>
        <Link href={`/learn/${language}`} className="text-amber-400 hover:underline text-sm">
          Back to courses
        </Link>
      </div>
    );
  }

  const c = course.data;
  const pct = stats ? Math.round(stats.pct) : 0;
  const embed = selected ? toYouTubeEmbed(selected.youtube_video_id) : null;
  const notes = selected ? safeUrl(selected.notes_url) : null;

  // Public instructor profile (/instructors/[id])
  const instructorId = c.instructor?.id ? String(c.instructor.id) : null;
  const instructorHref = instructorId ? `/instructors/${instructorId}` : null;

  const enrollControl = enrolled ? null : c.is_free ? (
    <button
      onClick={handleEnroll}
      disabled={busy}
      className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-600 text-white disabled:opacity-50"
    >
      {busy ? "Enrolling…" : "Enroll free"}
    </button>
  ) : (
    <RazorpayCheckout
      courseId={courseId}
      onSuccess={handlePaidSuccess}
      onError={setActionError}
      itemName={c.title}
      instructor={c.instructor?.full_name}
      mode="Online Course"
      price={c.price}
    />
  );

  return (
    <div className="min-h-screen bg-[#0a0908] text-white relative overflow-hidden flex flex-col justify-between">
      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-15 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0908]/85 via-[#0a0908]/95 to-[#0a0908] pointer-events-none" />

      <div className="border-b border-stone-800/80 bg-stone-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link
            href={`/learn/${language}`}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to courses
          </Link>
          {enrolled && stats && (
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 rounded-full bg-stone-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-stone-400 font-semibold">{pct}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-stone-500">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 font-semibold capitalize">{c.level}</span>
            <span>{c.language}</span>
            {c.duration && <span>• {c.duration}</span>}
            <span>
              •{" "}
              {instructorHref ? (
                <Link
                  href={instructorHref}
                  className="text-amber-300/90 hover:text-amber-300 hover:underline underline-offset-2 transition-colors"
                >
                  {c.instructor?.full_name}
                </Link>
              ) : (
                c.instructor?.full_name
              )}
            </span>
          </div>
          <h1 className="font-kalam text-4xl md:text-5xl font-bold mb-3 leading-tight">{c.title}</h1>
          {c.description && <p className="text-stone-400 max-w-2xl">{c.description}</p>}
        </div>

        {actionError && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">
            {actionError}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            {successMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          {/* Player */}
          <div className="space-y-6">
            {!selected ? (
              <div className="text-center py-16 rounded-2xl bg-stone-900/40 border border-stone-700/50">
                <BookOpen className="w-10 h-10 mx-auto mb-3 text-amber-400/30" />
                <p className="text-stone-400 text-sm">The instructor hasn&apos;t added lessons to this course yet.</p>
              </div>
            ) : !selected.is_unlocked ? (
              <div className="text-center py-16 px-6 rounded-2xl bg-stone-900/40 border border-stone-700/50 space-y-4">
                <Lock className="w-10 h-10 mx-auto text-stone-500" />
                <h3 className="text-xl font-bold">{selected.title}</h3>
                <p className="text-stone-400 text-sm">Enroll in this course to unlock this lesson.</p>
                <div className="max-w-xs mx-auto">{enrollControl}</div>
              </div>
            ) : (
              <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 overflow-hidden">
                {embed ? (
                  <div className="aspect-video">
                    <iframe
                      src={embed}
                      title={selected.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video flex flex-col items-center justify-center text-stone-500 bg-stone-950/60">
                    <Play className="w-10 h-10 mb-2" />
                    <span className="text-sm">No video for this lesson</span>
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <h2 className="font-kalam text-2xl font-bold">{selected.title}</h2>
                  {selected.description && <p className="text-stone-400 text-sm leading-relaxed">{selected.description}</p>}

                  <div className="flex flex-wrap items-center gap-3">
                    {notes && (
                      <a
                        href={notes}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-semibold border border-stone-700/50"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Lesson notes
                      </a>
                    )}
                    {enrolled && (
                      <button
                        onClick={() => handleToggle(selected)}
                        disabled={busy}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border disabled:opacity-50 ${
                          completed.has(selected.id)
                            ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                            : "bg-amber-500/20 border-amber-500/30 text-amber-300"
                        }`}
                      >
                        {completed.has(selected.id) ? (
                          <>
                            <CheckCircle className="w-4 h-4" /> Completed (undo)
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4" /> Mark as complete
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Extra study materials attached to the course */}
            {c.resources.length > 0 && (
              <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 p-6">
                <h3 className="font-kalam text-lg font-bold mb-4">Study materials</h3>
                <ul className="space-y-3">
                  {c.resources.map((r) => {
                    const href = safeUrl(r.url);
                    return (
                      <li key={r.id} className="flex items-start justify-between gap-3 text-sm">
                        <div>
                          <p className="text-white font-medium">{r.title}</p>
                          <p className="text-xs text-stone-500 capitalize">
                            {r.type}
                            {r.duration ? ` • ${r.duration}` : ""}
                          </p>
                          {r.description && <p className="text-xs text-stone-400 mt-1">{r.description}</p>}
                        </div>
                        {href && (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-amber-400 hover:text-amber-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 p-6">
              {enrolled && stats ? (
                <>
                  <h3 className="font-kalam text-lg font-bold mb-3">Your progress</h3>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-4xl font-bold text-amber-400">{pct}%</span>
                    <span className="text-sm text-stone-400">
                      {stats.done}/{stats.total} lessons
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-stone-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${pct}%` }} />
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-kalam text-lg font-bold mb-3">{c.is_free ? "Free course" : `₹${c.price}`}</h3>
                  <p className="text-stone-500 text-xs mb-4">
                    {c.lessons_count} lessons in {c.modules_count} modules
                  </p>
                  {enrollControl}
                </>
              )}
            </div>

            {/* Instructor */}
            {c.instructor?.full_name && (
              <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 p-6">
                <h3 className="font-kalam text-lg font-bold mb-3">Your instructor</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-600/30 border border-amber-500/30 flex items-center justify-center text-amber-300 font-kalam text-xl font-bold shrink-0">
                    {c.instructor.full_name.trim()[0]?.toUpperCase() ?? "?"}
                  </div>
                  <p className="text-sm font-semibold text-white min-w-0 truncate">{c.instructor.full_name}</p>
                </div>
                {instructorHref && (
                  <Link
                    href={instructorHref}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-semibold border border-stone-700/50 transition-colors"
                  >
                    <UserCircle className="w-4 h-4" /> View instructor profile
                  </Link>
                )}
              </div>
            )}

            <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 p-4">
              <h3 className="font-kalam text-lg font-bold mb-3 px-2">Curriculum</h3>
              {modules.length === 0 ? (
                <p className="text-stone-500 text-sm px-2">No modules yet.</p>
              ) : (
                <div className="space-y-4">
                  {modules.map((m) => (
                    <div key={m.id}>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500 px-2 mb-1">{m.title}</p>
                      <ul className="space-y-1">
                        {m.lessons.map((l) => {
                          const isSel = selected?.id === l.id;
                          return (
                            <li key={l.id}>
                              <button
                                onClick={() => setSelectedId(l.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm transition-all ${
                                  isSel ? "bg-amber-500/15 border border-amber-500/30" : "hover:bg-stone-800/60 border border-transparent"
                                }`}
                              >
                                {completed.has(l.id) ? (
                                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                                ) : !l.is_unlocked ? (
                                  <Lock className="w-4 h-4 text-stone-600 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-stone-600 shrink-0" />
                                )}
                                <span className="flex-1 text-stone-200">{l.title}</span>
                                {l.is_preview && !enrolled && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                    Preview
                                  </span>
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}