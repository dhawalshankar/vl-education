"use client";
import React, { useState, useEffect } from "react";
import { 
  X, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Lock, 
  Play, 
  BookOpen, 
  Sparkles,
  Award
} from "lucide-react";
import { courseAPI, enrollmentAPI } from "@/app/lib/api";

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  youtube_video_id?: string | null;
  notes_url?: string | null;
  order_index: number;
  is_preview: boolean;
  is_unlocked: boolean;
}

interface Module {
  id: string;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

interface CourseDetail {
  id: string;
  title: string;
  description?: string;
  language: string;
  level: string;
  price: string;
  is_free: boolean;
  modules: Module[];
}

interface CoursePlayerModalProps {
  courseId: string;
  onClose: () => void;
  onProgressUpdated?: () => void;
}

export default function CoursePlayerModal({
  courseId,
  onClose,
  onProgressUpdated,
}: CoursePlayerModalProps) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [toggling, setToggling] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const courseData = await courseAPI.getOne(courseId);
      setCourse(courseData);

      // Set initial active lesson to first preview or first lesson
      if (courseData.modules?.length > 0 && courseData.modules[0].lessons?.length > 0) {
        const first = courseData.modules[0].lessons[0];
        setActiveLesson(first);
      }

      // Fetch progress
      const progress = await enrollmentAPI.getProgress(courseId);
      if (progress) {
        setCompletedLessonIds(progress.completed_lesson_ids || []);
        setProgressPercentage(progress.progress_percentage || 0);
      }
    } catch (err) {
      console.error("Error loading course details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const handleToggle = async (lesson: Lesson) => {
    try {
      setToggling(lesson.id);
      const res = await enrollmentAPI.toggleLesson(courseId, lesson.id);
      
      if (res.is_completed) {
        setCompletedLessonIds((prev) => [...prev, lesson.id]);
      } else {
        setCompletedLessonIds((prev) => prev.filter((id) => id !== lesson.id));
      }
      setProgressPercentage(res.course_progress_percentage);
      if (onProgressUpdated) onProgressUpdated();
    } catch (err) {
      console.error("Error toggling progress", err);
    } finally {
      setToggling(null);
    }
  };

  if (loading || !course) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="w-8 h-8 border-2 border-[#FF5500] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading Learning Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-hidden">
      <div className="w-full max-w-6xl h-[90vh] bg-[#14110E] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header */}
      <div className="px-3 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between gap-2 bg-[#181512]/90">
        <div className="min-w-0 flex-1 flex items-center gap-2 sm:gap-3">
            <span className="px-3 py-1 rounded-full bg-[#FF5500]/15 text-[#FF7700] text-xs font-semibold">
              {course.language} • {course.level}
            </span>
          <h2 className="min-w-0 text-white text-sm sm:text-lg font-bold truncate max-w-md">
              {course.title}
            </h2>
          </div>

        <div className="shrink-0 flex items-center gap-2 sm:gap-4">
            {/* Live Progress Indicator */}
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="text-xs text-white/70 font-medium">Progress:</span>
              <span className="text-xs font-bold text-[#FF6600]">{progressPercentage}%</span>
              <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF5500] to-amber-400 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Grid: Video Player + Syllabus Sidebar */}
        <div className="min-h-0 flex-1 grid grid-cols-1 grid-rows-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:grid-cols-12 lg:grid-rows-1 overflow-hidden">
          
          {/* Left Area (8 cols): Video Player & Notes */}
          <div className="min-h-0 lg:col-span-8 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto bg-black/30">
            {activeLesson ? (
              <div className="space-y-4">
                {/* Video Embed or Lock Card */}
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 relative shadow-2xl flex items-center justify-center">
                  {activeLesson.is_unlocked && activeLesson.youtube_video_id ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${activeLesson.youtube_video_id}?autoplay=0&rel=0`}
                      title={activeLesson.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-6 text-center max-w-sm">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                        <Lock className="w-6 h-6 text-amber-500" />
                      </div>
                      <h3 className="text-white font-bold text-base">Lesson Locked</h3>
                      <p className="text-xs text-white/60">
                        This lesson is part of the full curriculum. Enroll in the course to unlock all videos and resources.
                      </p>
                    </div>
                  )}
                </div>

                {/* Lesson Info & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">
                      {activeLesson.title}
                    </h3>
                    <p className="text-xs text-white/60 mt-1">
                      {activeLesson.description || "Watch this lesson and complete the supporting practice exercises."}
                    </p>
                  </div>

                  {/* Supporting Google Drive Notes Link */}
                  {activeLesson.notes_url && activeLesson.is_unlocked && (
                    <a
                      href={activeLesson.notes_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-400 text-xs font-semibold transition-all"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Class Notes (Google Drive)</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                    </a>
                  )}
                </div>

                {/* Mark Complete Checkbox CTA */}
                {activeLesson.is_unlocked && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0 flex items-center gap-3">
                      <button
                        onClick={() => handleToggle(activeLesson)}
                        disabled={toggling === activeLesson.id}
                        className="text-white transition-transform active:scale-90"
                      >
                        {completedLessonIds.includes(activeLesson.id) ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-white/40 hover:text-white/80" />
                        )}
                      </button>
                      <span className="text-xs sm:text-sm font-medium text-white/90">
                        {completedLessonIds.includes(activeLesson.id) 
                          ? "Lesson marked as complete! 🎉" 
                          : "Mark this lesson as completed"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggle(activeLesson)}
                      disabled={toggling === activeLesson.id}
                      className={`w-full sm:w-auto text-xs px-4 py-2 rounded-xl font-semibold transition-all ${
                        completedLessonIds.includes(activeLesson.id)
                          ? "bg-white/10 text-white/80 hover:bg-white/15"
                          : "btn-primary"
                      }`}
                    >
                      {completedLessonIds.includes(activeLesson.id) ? "Completed ✓" : "Done with Lesson"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-white/40 text-sm">Select a lesson from the syllabus to start watching.</p>
            )}
          </div>

          {/* Right Area (4 cols): Interactive Syllabus Accordion */}
          <div className="min-h-0 lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#16130F] flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Course Curriculum</h4>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {course.modules?.map((mod, modIdx) => (
                <div key={mod.id} className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
                  <div className="px-3.5 py-2.5 bg-white/[0.02] border-b border-white/5">
                    <p className="text-[11px] font-bold text-[#FF6600] uppercase tracking-wider">
                      Module {modIdx + 1}
                    </p>
                    <p className="text-xs font-semibold text-white/90 truncate">{mod.title}</p>
                  </div>

                  <div className="divide-y divide-white/5">
                    {mod.lessons?.map((les, lesIdx) => {
                      const isActive = activeLesson?.id === les.id;
                      const isDone = completedLessonIds.includes(les.id);

                      return (
                        <div
                          key={les.id}
                          onClick={() => setActiveLesson(les)}
                          className={`px-3.5 py-3 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isActive 
                              ? "bg-[#FF5500]/15 border-l-2 border-[#FF5500]" 
                              : "hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Done check or status icon */}
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : les.is_unlocked ? (
                              <Play className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#FF6600]" : "text-white/40"}`} />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-white/30 shrink-0" />
                            )}
                            <span className={`text-xs truncate ${isActive ? "text-white font-semibold" : "text-white/80"}`}>
                              {modIdx + 1}.{lesIdx + 1} {les.title}
                            </span>
                          </div>

                          {les.is_preview && !les.is_unlocked && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold shrink-0">
                              Preview
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Course Completion Celebration */}
            {progressPercentage === 100 && (
              <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-t border-emerald-500/30 flex items-center gap-3">
                <Award className="w-7 h-7 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Course Completed! 🎓</p>
                  <p className="text-[11px] text-white/70">You mastered this course syllabus.</p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
