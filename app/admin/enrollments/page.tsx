"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, RotateCcw, Search, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { adminAPI } from "@/app/lib/api";
import type { AdminCourse, AdminEnrollmentFinancial, AdminInstructor } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";

const date = (value?: string | null) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const money = (amount?: string | number | null, currency?: string | null) => amount == null ? "—" : `${currency ?? ""} ${amount}`.trim();
const selectClass = "bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-sm text-stone-200";

export default function AdminEnrollmentsPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const allowed = !!user && !!isAdmin;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [skip, setSkip] = useState(0);
  const [selected, setSelected] = useState<AdminEnrollmentFinancial | null>(null);
  const [refundTarget, setRefundTarget] = useState<AdminEnrollmentFinancial | null>(null);
  const limit = 50;

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth/login");
    else if (!allowed) router.replace("/dashboard");
  }, [allowed, loading, router, user]);
  const query = useApi(() => adminAPI.enrollmentFinancials({
    instructor_id: instructorId, course_id: courseId, enrollment_status: status, search, skip, limit,
  }), [allowed, instructorId, courseId, status, search, skip], allowed);
  const instructorsQ = useApi(() => adminAPI.instructors(), [allowed], allowed);
  const coursesQ = useApi(() => adminAPI.courses(), [allowed], allowed);
  const instructors: AdminInstructor[] = instructorsQ.data ?? [];
  const courses: AdminCourse[] = coursesQ.data ?? [];
  const rows = query.data?.items ?? [];
  if (loading || !allowed) return <div className="cultural-page min-h-screen flex items-center justify-center text-amber-400">Loading...</div>;

  return <div className="cultural-page min-h-screen text-white flex flex-col"><Navbar /><main className="max-w-7xl mx-auto px-6 pt-36 pb-20 w-full">
    <h1 className="font-kalam text-4xl font-bold mb-2">Enrollment and payments</h1>
    <p className="text-stone-400 text-sm mb-8">Review student enrollments and payment records. Refunds are prepared here but processed by the backend.</p>
    <div className="flex flex-wrap gap-3 mb-5">
      <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 rounded-xl px-3"><Search className="w-4 h-4 text-stone-500" /><input value={search} onChange={(event) => { setSearch(event.target.value); setSkip(0); }} placeholder="Search student name or email" className="bg-transparent outline-none py-2.5 text-sm" /></div>
      <select value={instructorId} onChange={(event) => { setInstructorId(event.target.value); setSkip(0); }} className={selectClass}><option value="">All instructors</option>{instructors.map((item) => <option key={item.id} value={item.id}>{item.full_name}</option>)}</select>
      <select value={courseId} onChange={(event) => { setCourseId(event.target.value); setSkip(0); }} className={selectClass}><option value="">All courses</option>{courses.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select>
      <select value={status} onChange={(event) => { setStatus(event.target.value); setSkip(0); }} className={selectClass}><option value="">All statuses</option><option value="active">Active</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
    </div>
    {(query.error || instructorsQ.error || coursesQ.error) && <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{query.error || instructorsQ.error || coursesQ.error}</div>}
    <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 overflow-x-auto"><table className="w-full min-w-[1300px] text-sm">
      <thead><tr className="text-left text-xs uppercase tracking-wider text-stone-500 border-b border-stone-800"><th className="p-4">Student</th><th className="p-4">Course / instructor</th><th className="p-4">Enrollment</th><th className="p-4">Payment</th><th className="p-4">Dates</th><th className="p-4">Actions</th></tr></thead>
      <tbody>{query.loading ? <tr><td colSpan={6} className="p-10 text-center text-stone-500">Loading enrollments…</td></tr> : rows.length === 0 ? <tr><td colSpan={6} className="p-10 text-center text-stone-500">No enrollment records found.</td></tr> : rows.map((row) => {
        const payment = row.payment;
        return <tr key={row.id} className="border-b border-stone-800/50 align-top"><td className="p-4"><p>{row.student_name}</p><p className="text-xs text-stone-500">{row.student_email}</p></td><td className="p-4"><p>{row.course_title}</p><p className="text-xs text-stone-500">{row.instructor_name} · {money(row.course_price, payment?.currency)}</p></td><td className="p-4"><p>{row.enrollment_status}</p><p className="text-xs text-stone-500">{date(row.enrolled_at)}</p></td><td className="p-4"><p>{payment?.status ?? "—"}</p><p className="text-xs text-emerald-300">{money(payment?.amount, payment?.currency)}</p></td><td className="p-4 text-xs text-stone-400">Enrolled {date(row.enrolled_at)}<br />Completed {date(row.completed_at)}<br />Paid {date(payment?.paid_at)}</td><td className="p-4"><button onClick={() => setSelected(row)} className="px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs flex items-center gap-2"><Eye className="w-4 h-4" /> Details</button></td></tr>;
      })}</tbody>
    </table></div>
    <div className="flex justify-end gap-3 mt-4"><button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))} className="px-4 py-2 rounded-lg bg-stone-800 disabled:opacity-40">Previous</button><span className="text-xs text-stone-500 py-2">Rows {skip + 1}–{skip + rows.length}</span><button disabled={rows.length < limit} onClick={() => setSkip(skip + limit)} className="px-4 py-2 rounded-lg bg-stone-800 disabled:opacity-40">Next</button></div>
  </main><Footer />
  {selected && <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"><div className="bg-[#120F0C] border border-stone-700 rounded-2xl p-6 w-full max-w-lg"><div className="flex justify-between"><h2 className="font-semibold text-lg">Enrollment payment details</h2><button onClick={() => setSelected(null)}><X /></button></div><div className="mt-5 space-y-3 text-sm"><p><b>Student:</b> {selected.student_name} ({selected.student_email})</p><p><b>Course:</b> {selected.course_title}</p><p><b>Instructor:</b> {selected.instructor_name}</p><p><b>Payment:</b> {selected.payment?.status ?? "—"} · {money(selected.payment?.amount, selected.payment?.currency)}</p><p><b>Razorpay order ID:</b> {selected.payment?.razorpay_order_id ?? "—"}</p><p><b>Razorpay payment ID:</b> {selected.payment?.razorpay_payment_id ?? "—"}</p><p><b>Payment date:</b> {date(selected.payment?.paid_at)}</p></div><button disabled={selected.payment?.status !== "paid"} onClick={() => setRefundTarget(selected)} className="mt-6 w-full px-4 py-3 rounded-xl bg-amber-500 text-stone-950 font-bold disabled:opacity-40 flex justify-center gap-2"><RotateCcw className="w-4 h-4" /> {selected.payment?.status === "paid" ? "Prepare refund" : "Refund unavailable"}</button></div></div>}
  {refundTarget && <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"><div className="bg-[#120F0C] border border-amber-500/40 rounded-2xl p-6 w-full max-w-md"><div className="flex justify-between"><h2 className="font-semibold text-lg">Confirm refund preparation</h2><button onClick={() => setRefundTarget(null)}><X /></button></div><div className="mt-5 space-y-3 text-sm"><p><b>Student:</b> {refundTarget.student_name}</p><p><b>Email:</b> {refundTarget.student_email}</p><p><b>Course:</b> {refundTarget.course_title}</p><p><b>Refund amount:</b> {money(refundTarget.payment?.amount, refundTarget.payment?.currency)}</p><p><b>Razorpay payment ID:</b> {refundTarget.payment?.razorpay_payment_id ?? "—"}</p></div><button disabled className="mt-6 w-full px-4 py-3 rounded-xl bg-stone-700 text-stone-300 font-bold cursor-not-allowed">Refund API coming soon</button></div></div>}
  </div>;
}
