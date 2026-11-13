// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/auth/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="cultural-page min-h-screen flex items-center justify-center">
        <div className="text-amber-400 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="cultural-page min-h-screen text-white relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-35 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=85')`,
          filter: "contrast(110%) brightness(75%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 20%, rgba(255, 85, 0, 0.12), transparent 70%),
            linear-gradient(180deg, rgba(14, 12, 10, 0.55) 0%, rgba(14, 12, 10, 0.78) 55%, #0e0c0a 100%)
          `,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-20 w-full">
        <div className="flex items-center gap-4 mb-2">
          {user.avatar_url && !avatarFailed ? (
            <img src={user.avatar_url} alt={user.full_name} onError={() => setAvatarFailed(true)} className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center text-xl font-bold text-stone-950">{user.full_name.charAt(0).toUpperCase()}</div>
          )}
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.full_name}!</h1>
            <span className="inline-block mt-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs uppercase tracking-wide text-amber-300">{user.role}</span>
          </div>
        </div>
        <p className="text-stone-500 text-sm mb-10">{user.email}</p>
        <h2 className="text-2xl font-bold mb-5">My Courses</h2>
        <div className="bg-stone-900/40 border border-stone-700/50 rounded-2xl p-10 text-center text-stone-500">
          <UserCircle className="w-10 h-10 mx-auto mb-3 text-amber-400/30" />
          <p>No enrollments yet.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}