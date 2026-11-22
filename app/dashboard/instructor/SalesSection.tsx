"use client";

import { BarChart3 } from "lucide-react";
import { InstructorSales } from "@/app/lib/api";
import { formatSalesCurrency, sortSalesByRevenue } from "@/app/lib/sales";

export function SalesSection({
  sales,
  loading,
  error,
}: {
  sales: InstructorSales | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return <div className="h-72 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />;
  }

  if (error) {
    return <div className="p-4 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">Could not load sales analytics: {error}</div>;
  }

  if (!sales || sales.courses.length === 0) {
    return (
      <div className="p-16 rounded-3xl bg-stone-900/40 border border-stone-800 text-center">
        <BarChart3 className="w-10 h-10 mx-auto mb-4 text-amber-400/50" />
        <h3 className="font-kalam text-2xl font-bold mb-2">No sales yet</h3>
        <p className="text-sm text-stone-400">Course sales will appear here once students purchase your courses.</p>
      </div>
    );
  }

  const currency = sales.courses[0].currency;
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-kalam text-3xl font-bold">Sales analytics</h2>
        <p className="text-sm text-stone-400 mt-1">Aggregate sales performance across your courses.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["Total courses", sales.totalCourses],
          ["Total sales", sales.totalSales],
          ["Total revenue", formatSalesCurrency(sales.totalRevenue, currency)],
        ].map(([label, value]) => (
          <div key={label} className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800">
            <p className="text-2xl font-bold tabular-nums">{value}</p>
            <p className="text-xs text-stone-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-stone-500 border-b border-stone-800">
              <th className="p-4">Course</th>
              <th className="p-4">Price</th>
              <th className="p-4">Sold</th>
              <th className="p-4">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {sortSalesByRevenue(sales.courses).map((course) => (
              <tr key={course.courseId} className="border-b border-stone-800/50">
                <td className="p-4 font-medium">{course.courseTitle}</td>
                <td className="p-4 text-stone-300">{formatSalesCurrency(course.coursePrice, course.currency)}</td>
                <td className="p-4 text-stone-300">{course.salesCount}</td>
                <td className="p-4 font-semibold text-emerald-300">
                  {formatSalesCurrency(course.totalRevenue, course.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
