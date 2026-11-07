// app/learn/[language]/[courseId]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  ExternalLink,
  FileText,
  Lock,
  Play,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { enrollmentAPI, learnAPI, LessonOut } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";
import RazorpayCheckout from "@/components/RazorpayCheckout";
import Footer from "@/components/Footer";

type Tab = "overview" | "materials" | "instructor";

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

function InstructorAvatar({ name, url }: { name: string; url?: string | null }) {
  const [failed, setFailed] = useState(false);
  if (url && /^https:\/\//i.test(url) && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name}
        onError={() => setFailed(true)}
        referrerPolicy="no-referrer"
        className="w-12 h-12 rounded-full object-cover border border-amber-500/30 shrink-0"
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-600/30 border border-amber-500/30 flex items-center justify-center text-amber-300 text-lg font-bold shrink-0">
      {name.trim()[0]?.toUpperCase() ?? "?"}
    </div>
  );
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
  const [tab, setTab] = useState<Tab>("overview");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
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
  const selectedIdx = selected ? allLessons.findIndex((l) => l.id === selected.id) : -1;
  const prevLesson = selectedIdx > 0 ? allLessons[selectedIdx - 1] : null;
  const nextLesson = selectedIdx >= 0 && selectedIdx < allLessons.length - 1 ? allLessons[selectedIdx + 1] : null;

  const toggleModule = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

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
    const query = new URLSearchParams({
      courseId,
      language,
      title: c.title,
    });
    router.replace(`/payment-success?${query.toString()}`);
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
  const embedBase = selected ? toYouTubeEmbed(selected.youtube_video_id) : null;
  const embed = embedBase ? `${embedBase}${embedBase.includes("?") ? "&" : "?"}rel=0` : null;
  const notes = selected ? safeUrl(selected.notes_url) : null;

  // Public instructor profile (/instructors/[id])
  const instructorId = c.instructor?.id ? String(c.instructor.id) : null;
  const instructorHref = instructorId ? `/instructors/${instructorId}` : null;

  const enrollControl = enrolled ? null : c.is_free ? (
    <button
      onClick={handleEnroll}
      disabled={busy}
      className="w-full py-2.5 rounded-lg font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-950 disabled:opacity-50 transition-colors"
    >
      {busy ? "Enrolling…" : "Enroll for free"}
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

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "materials", label: `Materials${c.resources.length ? ` (${c.resources.length})` : ""}` },
    { id: "instructor", label: "Instructor" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0908] text-white flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-stone-800 bg-[#0a0908]/95 backdrop-blur">
        <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-6 h-14 flex items-center gap-4">
          <Link
            href={`/learn/${language}`}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors text-xs font-medium shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to courses</span>
          </Link>
          <div className="h-5 w-px bg-stone-800 hidden sm:block" />
          <p className="text-sm font-semibold truncate flex-1">{c.title}</p>
          {enrolled && stats && (
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-24 h-1.5 rounded-full bg-stone-800 overflow-hidden hidden sm:block">
                <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-stone-400">{pct}% complete</span>
            </div>
          )}
        </div>
      </header>

      {/* w-full matters: in a flex column, mx-auto alone would shrink this to its content width */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 lg:px-6 py-5">
        {actionError && (
          <div className="mb-4 px-4 py-2.5 rounded-lg text-sm bg-red-500/10 border border-red-500/20 text-red-300">
            {actionError}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 px-4 py-2.5 rounded-lg text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            {successMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
          {/* ───────── Left: player + details ───────── */}
          <section className="min-w-0">
            {!selected ? (
              <div className="text-center py-20 rounded-xl bg-stone-900/40 border border-stone-800">
                <BookOpen className="w-10 h-10 mx-auto mb-3 text-amber-400/30" />
                <p className="text-stone-400 text-sm">The instructor hasn&apos;t added lessons to this course yet.</p>
              </div>
            ) : (
              <>
                <div className="rounded-xl overflow-hidden bg-black border border-stone-800">
                  {!selected.is_unlocked ? (
                    <div className="aspect-video max-h-[72vh] w-full flex flex-col items-center justify-center gap-3 px-6 text-center bg-stone-950">
                      <Lock className="w-8 h-8 text-stone-500" />
                      <p className="text-sm text-stone-300">Enroll in this course to watch this lesson.</p>
                      <div className="w-full max-w-[220px]">{enrollControl}</div>
                    </div>
                  ) : embed ? (
                    <div className="aspect-video max-h-[72vh] w-full">
                      <iframe
                        key={selected.id}
                        src={embed}
                        title={selected.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video max-h-[72vh] w-full flex flex-col items-center justify-center text-stone-500 bg-stone-950">
                      <Play className="w-9 h-9 mb-2" />
                      <span className="text-sm">No video for this lesson</span>
                    </div>
                  )}
                </div>

                {/* Lesson bar */}
                <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold leading-snug">{selected.title}</h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Lesson {selectedIdx + 1} of {allLessons.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => prevLesson && setSelectedId(prevLesson.id)}
                      disabled={!prevLesson}
                      title="Previous lesson"
                      aria-label="Previous lesson"
                      className="p-1.5 rounded-lg border border-stone-700 text-stone-300 hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => nextLesson && setSelectedId(nextLesson.id)}
                      disabled={!nextLesson}
                      title="Next lesson"
                      aria-label="Next lesson"
                      className="p-1.5 rounded-lg border border-stone-700 text-stone-300 hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    {selected.is_unlocked && notes && (
                      <a
                        href={notes}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-medium transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Notes
                      </a>
                    )}
                    {enrolled && selected.is_unlocked && (
                      <button
                        onClick={() => handleToggle(selected)}
                        disabled={busy}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-50 transition-colors ${
                          completed.has(selected.id)
                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                            : "border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
                        }`}
                      >
                        {completed.has(selected.id) ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5" /> Mark complete
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Tabs */}
            <div className="mt-6 border-b border-stone-800 flex gap-6 overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`pb-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
                    tab === t.id ? "border-amber-400 text-white" : "border-transparent text-stone-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="py-6">
              {tab === "overview" && (
                <div className="space-y-5 max-w-3xl">
                  <div>
                    <h1 className="text-2xl font-semibold leading-snug mb-2">{c.title}</h1>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400">
                      <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-medium capitalize">{c.level}</span>
                      <span>{c.language}</span>
                      {c.duration && <span>• {c.duration}</span>}
                      <span>
                        • {c.modules_count} modules, {c.lessons_count} lessons
                      </span>
                    </div>
                  </div>
                  {c.description && (
                    <div>
                      <h3 className="text-sm font-semibold mb-1.5">About this course</h3>
                      <p className="text-sm text-stone-300 leading-relaxed whitespace-pre-line">{c.description}</p>
                    </div>
                  )}
                  {selected?.is_unlocked && selected.description && (
                    <div>
                      <h3 className="text-sm font-semibold mb-1.5">About this lesson</h3>
                      <p className="text-sm text-stone-300 leading-relaxed whitespace-pre-line">{selected.description}</p>
                    </div>
                  )}
                </div>
              )}

              {tab === "materials" && (
                <div className="max-w-3xl">
                  {c.resources.length === 0 ? (
                    <p className="text-sm text-stone-500">No study materials for this course.</p>
                  ) : (
                    <ul className="divide-y divide-stone-800 rounded-xl border border-stone-800 bg-stone-900/40">
                      {c.resources.map((r) => {
                        const href = safeUrl(r.url);
                        return (
                          <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                            <FileText className="w-4 h-4 text-stone-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{r.title}</p>
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
                                title="Open"
                                className="shrink-0 p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

              {tab === "instructor" && (
                <div className="max-w-3xl">
                  {c.instructor?.full_name ? (
                    <div className="flex items-center gap-4">
                      <InstructorAvatar name={c.instructor.full_name} url={c.instructor.avatar_url} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">{c.instructor.full_name}</p>
                        <p className="text-xs text-stone-500">Instructor</p>
                      </div>
                      {instructorHref && (
                        <Link
                          href={instructorHref}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-medium transition-colors shrink-0"
                        >
                          <UserCircle className="w-3.5 h-3.5" /> View profile
                        </Link>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-500">Instructor details are not available.</p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ───────── Right: price / progress + curriculum ───────── */}
          <aside className="lg:sticky lg:top-[72px] space-y-4">
            <div className="rounded-xl bg-stone-900/60 border border-stone-800 p-4">
              {enrolled && stats ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">Your progress</h3>
                    <span className="text-xs text-stone-400">
                      {stats.done}/{stats.total} lessons
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                    <div className="h-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </>
              ) : enrolled ? (
                <p className="text-sm text-stone-400">You are enrolled.</p>
              ) : (
                <>
                  <p className="text-2xl font-bold">{c.is_free ? "Free" : `₹${c.price}`}</p>
                  <p className="text-xs text-stone-500 mt-0.5 mb-3">
                    {c.lessons_count} lessons in {c.modules_count} modules
                  </p>
                  {enrollControl}
                </>
              )}
            </div>

            <div className="rounded-xl bg-stone-900/60 border border-stone-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-stone-800">
                <h3 className="text-sm font-semibold">Course content</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {modules.length} {modules.length === 1 ? "module" : "modules"} • {allLessons.length}{" "}
                  {allLessons.length === 1 ? "lesson" : "lessons"}
                </p>
              </div>

              {modules.length === 0 ? (
                <p className="text-stone-500 text-sm px-4 py-5">No modules yet.</p>
              ) : (
                <div className="lg:max-h-[calc(100vh-260px)] overflow-y-auto">
                  {modules.map((m) => {
                    const isCollapsed = collapsed.has(m.id);
                    const doneInModule = m.lessons.filter((l) => completed.has(l.id)).length;
                    return (
                      <div key={m.id} className="border-b border-stone-800/70 last:border-b-0">
                        <button
                          onClick={() => toggleModule(m.id)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-stone-900/50 hover:bg-stone-800/50 text-left transition-colors"
                        >
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold truncate">{m.title}</span>
                            <span className="block text-[11px] text-stone-500 mt-0.5">
                              {enrolled ? `${doneInModule}/${m.lessons.length} completed` : `${m.lessons.length} lessons`}
                            </span>
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-stone-500 shrink-0 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                          />
                        </button>

                        {!isCollapsed && (
                          <ul>
                            {m.lessons.map((l) => {
                              const isSel = selected?.id === l.id;
                              return (
                                <li key={l.id}>
                                  <button
                                    onClick={() => setSelectedId(l.id)}
                                    className={`w-full flex items-start gap-3 px-4 py-2.5 text-left border-l-2 transition-colors ${
                                      isSel
                                        ? "bg-amber-500/10 border-amber-400"
                                        : "border-transparent hover:bg-stone-800/50"
                                    }`}
                                  >
                                    <span className="mt-0.5 shrink-0">
                                      {completed.has(l.id) ? (
                                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                                      ) : !l.is_unlocked ? (
                                        <Lock className="w-4 h-4 text-stone-600" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-stone-600" />
                                      )}
                                    </span>
                                    <span className="flex-1 min-w-0 text-[13px] leading-snug text-stone-200">{l.title}</span>
                                    {l.is_preview && !enrolled && (
                                      <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                                        Preview
                                      </span>
                                    )}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}