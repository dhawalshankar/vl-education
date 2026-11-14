"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { adminAPI } from "@/app/lib/api";
import type { AdminCourse, AdminInstructor, AdminInstructorEnrollment } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";

const money = (amount: string | number, currency: string) =>
  `${currency} ${amount}`;

export default function AdminReportsPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const allowed = !!user && !!isAdmin;
  const [instructorId, setInstructorId] = useState("");
  const [courseId, setCourseId] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth/login");
    else if (!allowed) router.replace("/dashboard");
  }, [allowed, loading, router, user]);

  const report = useApi(
    () => adminAPI.instructorEnrollments({ instructor_id: instructorId, course_id: courseId }),
    [allowed, instructorId, courseId],
    allowed
  );
  const instructorsQ = useApi(() => adminAPI.instructors(), [allowed], allowed);
  const coursesQ = useApi(() => adminAPI.courses(), [allowed], allowed);
  const instructors: AdminInstructor[] = instructorsQ.data ?? [];
  const courses: AdminCourse[] = coursesQ.data ?? [];
  const rows: AdminInstructorEnrollment[] = report.data ?? [];

  if (loading || !allowed) return <Loading />;

  return (
    <Shell title="Instructor revenue reports" subtitle="See enrollment volume and actual paid revenue by instructor and course.">
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={instructorId} onChange={(event) => setInstructorId(event.target.value)} className={selectClass}>
          <option value="">All instructors</option>
          {instructors.map((instructor) => <option key={instructor.id} value={instructor.id}>{instructor.full_name}</option>)}
        </select>
        <select value={courseId} onChange={(event) => setCourseId(event.target.value)} className={selectClass}>
          <option value="">All courses</option>
          {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
        </select>
      </div>
      {(report.error || instructorsQ.error || coursesQ.error) && (
        <ErrorBox message={report.error || instructorsQ.error || coursesQ.error || "Could not load report filters."} />
      )}
      <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead><tr className="text-left text-xs uppercase tracking-wider text-stone-500 border-b border-stone-800">
            <th className="p-4">Instructor</th><th className="p-4">Course</th><th className="p-4">Price</th>
            <th className="p-4">Enrollments</th><th className="p-4">Paid</th><th className="p-4">Actual revenue</th><th className="p-4">Currency</th>
          </tr></thead>
          <tbody>
            {report.loading ? <tr><td colSpan={7} className="p-10 text-center text-stone-500">Loading report…</td></tr> :
              rows.length === 0 ? <tr><td colSpan={7} className="p-10 text-center text-stone-500">No enrollment data found.</td></tr> :
                rows.map((row) => <tr key={`${row.instructor_id}-${row.course_id}`} className="border-b border-stone-800/50">
                  <td className="p-4"><p>{row.instructor_name}</p><p className="text-xs text-stone-500">{row.instructor_email}</p></td>
                  <td className="p-4">{row.course_title}</td><td className="p-4">{money(row.course_price, row.currency)}</td>
                  <td className="p-4">{row.enrollment_count}</td><td className="p-4">{row.paid_enrollment_count}</td>
                  <td className="p-4 font-semibold text-emerald-300">{money(row.total_paid_amount, row.currency)}</td><td className="p-4">{row.currency}</td>
                </tr>)}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}

const selectClass = "bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-200";
function Loading() { return <div className="cultural-page min-h-screen flex items-center justify-center text-amber-400">Loading...</div>; }
function ErrorBox({ message }: { message: string }) { return <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{message}</div>; }
function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <div className="cultural-page min-h-screen text-white flex flex-col"><Navbar /><main className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-36 pb-12 sm:pb-20 w-full">
    <div className="flex items-center gap-3 mb-2"><BarChart3 className="text-amber-400" /><h1 className="font-kalam text-4xl font-bold">{title}</h1></div>
    <p className="text-stone-400 text-sm mb-8">{subtitle}</p>{children}</main><Footer /></div>;
}
