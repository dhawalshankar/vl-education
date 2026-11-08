import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SalesSection } from "@/app/dashboard/instructor/page";
import { formatSalesCurrency, sortSalesByRevenue } from "@/app/lib/sales";

afterEach(cleanup);

describe("instructor sales analytics", () => {
  it("formats INR revenue using the returned currency", () => {
    expect(formatSalesCurrency(125000, "INR")).toBe("₹1,25,000.00");
  });

  it("sorts courses by revenue without mutating the response", () => {
    const courses = [
      { courseId: "a", courseTitle: "A", coursePrice: 10, currency: "INR", salesCount: 1, totalRevenue: 10 },
      { courseId: "b", courseTitle: "B", coursePrice: 20, currency: "INR", salesCount: 2, totalRevenue: 40 },
    ];
    expect(sortSalesByRevenue(courses).map((course) => course.courseId)).toEqual(["b", "a"]);
    expect(courses[0].courseId).toBe("a");
  });

  it("renders aggregate sales only, with no student-identifying fields", () => {
    render(
      <SalesSection
        loading={false}
        error={null}
        sales={{
          totalCourses: 1,
          totalSales: 2,
          totalRevenue: 598,
          courses: [
            {
              courseId: "course-1",
              courseTitle: "Hindi Basics",
              coursePrice: 299,
              currency: "INR",
              salesCount: 2,
              totalRevenue: 598,
            },
          ],
        }}
      />
    );
    expect(screen.getByText("Hindi Basics")).toBeInTheDocument();
    expect(screen.getAllByText("₹598.00")).toHaveLength(2);
    expect(screen.queryByText(/student|email|payment|razorpay|enrollment/i)).not.toBeInTheDocument();
  });

  it("renders loading, empty, and API error states", () => {
    const { rerender } = render(<SalesSection loading error={null} sales={null} />);
    expect(screen.queryByText("Sales analytics")).not.toBeInTheDocument();

    rerender(<SalesSection loading={false} error={null} sales={{ totalCourses: 0, totalSales: 0, totalRevenue: 0, courses: [] }} />);
    expect(screen.getByText("No sales yet")).toBeInTheDocument();

    rerender(<SalesSection loading={false} error="Forbidden" sales={null} />);
    expect(screen.getByText(/Could not load sales analytics: Forbidden/)).toBeInTheDocument();
  });
});
