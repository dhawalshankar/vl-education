import type { InstructorSalesCourse } from "@/app/lib/api";

export const formatSalesCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

export const sortSalesByRevenue = (courses: InstructorSalesCourse[]) =>
  [...courses].sort((a, b) => b.totalRevenue - a.totalRevenue);
