// components/Navbar.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  Flame,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Shield,
  BookOpen,
} from "lucide-react";
import { useUserStreak } from "@/app/lib/streak";

type NavItem = { label: string; href: string; ready: boolean };

const NAV_ITEMS: NavItem[] = [
  { label: "My Learning", href: "/dashboard", ready: true },
  { label: "Explore", href: "/learn", ready: true },
  { label: "Practice Labs", href: "/practice", ready: false },
  { label: "Challenges", href: "/challenges", ready: false },
  { label: "Certifications", href: "/certifications", ready: false },
  { label: "Community", href: "/community", ready: true },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const streakUserId = user?.email || user?.id;
  const { streak } = useUserStreak(streakUserId, isAuthenticated);

  // UserStreak has no `totalActiveDays` in its type. Read it defensively so the row only
  // shows if the hook actually provides it (add the field to UserStreak to make it permanent).
  const totalActiveDays = (streak as typeof streak & { totalActiveDays?: number }).totalActiveDays;

  const handleLogout = async () => {
    setShowMenu(false);
    setShowStreak(false);
    await logout();
    router.replace("/auth/login");
  };

  const renderItem = (item: NavItem, mobile = false) => {
    const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
    const base = mobile ? "px-3 py-2.5 rounded-xl text-sm" : "text-[13px]";

    if (!item.ready) {
      return (
        <span
          key={item.href}
          className={`${base} flex items-center gap-1.5 text-white/30 cursor-not-allowed select-none`}
        >
          {item.label}
          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-white/40">
            Soon
          </span>
        </span>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => {
          setShowMobile(false);
          setShowStreak(false);
          setShowMenu(false);
        }}
        className={`${base} flex items-center gap-1.5 transition-colors ${
          active ? "text-white font-semibold" : "text-white/70 hover:text-white"
        } ${mobile && active ? "bg-white/10" : ""}`}
      >
        {active && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />}
        {item.label}
      </Link>
    );
  };

  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-8 max-w-7xl mx-auto">
      <nav className="glass-panel rounded-full px-5 py-3 flex items-center justify-between shadow-2xl border border-white/10 bg-[#16130F]/85 backdrop-blur-xl">
        {/* Brand Logo */}
        <Link href={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2 group">
          <img
            src="/logo.png"
            alt="VartaLang Logo"
            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-lg"
          />
        </Link>

        {/* Center Nav Links (desktop) */}
        {isAuthenticated && (
          <div className="hidden lg:flex items-center gap-6 font-medium">
            {NAV_ITEMS.map((item) => renderItem(item))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Daily Streak Indicator */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowStreak(!showStreak);
                  setShowMenu(false);
                }}
                title={`Daily Streak: ${streak.currentStreak} day${streak.currentStreak === 1 ? "" : "s"}`}
                aria-label="Daily Streak"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-400 hover:text-orange-300 transition-all group"
              >
                <Flame className="w-4 h-4 fill-orange-500 text-orange-400 group-hover:scale-110 transition-transform animate-pulse" />
                <span className="text-xs font-bold font-mono tracking-tight text-orange-200">
                  {streak.currentStreak}
                </span>
              </button>

              {/* Streak Details Popover */}
              {showStreak && (
                <>
                  <div
                    className="fixed inset-0 z-40 sm:hidden bg-black/40 backdrop-blur-xs"
                    onClick={() => setShowStreak(false)}
                  />
                  <div className="fixed top-20 left-4 right-4 max-w-xs mx-auto sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 sm:w-72 sm:max-w-72 rounded-2xl bg-[#16130F]/95 border border-orange-500/30 shadow-2xl p-4 z-50 backdrop-blur-2xl">
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
                        <Flame className="w-5 h-5 text-orange-400 fill-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {streak.currentStreak} Day Streak
                        </p>
                        <p className="text-xs text-orange-300/80">
                          {streak.currentStreak > 0
                            ? "Great consistency! Keep learning."
                            : "Start your streak today!"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-stone-400">
                        <span>Longest Streak</span>
                        <span className="font-mono font-semibold text-white">
                          {streak.longestStreak} days
                        </span>
                      </div>
                      {totalActiveDays !== undefined && (
                        <div className="flex justify-between text-stone-400">
                          <span>Total Active Days</span>
                          <span className="font-mono font-semibold text-white">
                            {totalActiveDays}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* User profile dropdown or Sign In */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowMenu(!showMenu);
                  setShowStreak(false);
                }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/90 transition-all"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF5500] to-[#E64A00] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {user.full_name?.[0]}
                  </div>
                )}
                <span className="max-w-[120px] truncate hidden sm:block">{user.full_name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/60" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40 sm:hidden bg-black/40 backdrop-blur-xs"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="fixed top-20 right-4 left-auto max-w-[260px] sm:absolute sm:top-full sm:right-0 sm:mt-2 w-60 rounded-2xl bg-[#181512] border border-white/10 shadow-2xl p-2 z-50 backdrop-blur-2xl">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs text-white/95 font-semibold truncate">{user.full_name}</p>
                    <p className="text-[11px] text-white/50 truncate">{user.email}</p>
                    <p className="text-[10px] text-[#FF7700] uppercase font-bold tracking-wider mt-1">
                      {user.role}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setShowMenu(false)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#FF7700]" />
                    <span>My Dashboard</span>
                  </Link>
                  {(user.role === "admin" ||
                    user.email?.toLowerCase() === "cosmoindiaprakashan@gmail.com") && (
                    <Link
                      href="/dashboard/admin"
                      onClick={() => setShowMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-amber-300 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                  {(user.role === "instructor" ||
                    user.role === "admin" ||
                    user.email?.toLowerCase() === "cosmoindiaprakashan@gmail.com") && (
                    <Link
                      href="/dashboard/instructor"
                      onClick={() => setShowMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-sky-300 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-sky-400" />
                      <span>Instructor Studio</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 mt-1 border-t border-white/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#FF6600] text-white text-xs font-semibold transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            aria-label="Menu"
            onClick={() => {
              setShowMobile(!showMobile);
              setShowStreak(false);
              setShowMenu(false);
            }}
            className="lg:hidden w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/80"
          >
            {showMobile ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {showMobile && isAuthenticated && (
        <div className="lg:hidden mt-2 rounded-3xl bg-[#16130F]/95 border border-white/10 backdrop-blur-xl p-3 flex flex-col shadow-2xl gap-1">
          {NAV_ITEMS.map((item) => renderItem(item, true))}
          <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between px-3 py-1.5 text-xs text-stone-400">
            <div className="flex items-center gap-1.5 text-orange-400 font-semibold">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>{streak.currentStreak} Day Streak</span>
            </div>
            <span className="text-[10px] text-stone-500 font-mono">
              Best: {streak.longestStreak}d
            </span>
          </div>
        </div>
      )}
    </header>
  );
}