"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, User, LogOut, ArrowRight, Layers, Shield, Menu, X } from "lucide-react";

interface SessionUser {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
}

export default function Navbar() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Session fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090c15]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-blue-400 group-hover:border-blue-500/50 group-hover:text-blue-300 transition-all shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base tracking-tight text-white">
              Folio<span className="text-blue-400">Craft</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
              EncoderX
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-400">
          <Link href="/#features" className="hover:text-slate-100 transition-colors">
            Architecture
          </Link>
          <Link href="/#directory" className="hover:text-slate-100 transition-colors">
            Portfolios
          </Link>
          <Link href="/portfolio/johndoe" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <span>Live Showcase</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          </Link>
          <Link href="/#api-docs" className="hover:text-slate-100 transition-colors">
            API Specs
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {loading ? (
            <div className="w-24 h-8 bg-slate-800/50 rounded-lg animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                href={`/portfolio/${user.username}`}
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition"
              >
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Public Link</span>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 transition shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 transition shadow-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#090c15]/95 backdrop-blur-lg px-4 py-3 space-y-1.5 text-xs font-medium text-slate-300">
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-800/60 hover:text-white transition"
          >
            Architecture
          </Link>
          <Link
            href="/#directory"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-800/60 hover:text-white transition"
          >
            Portfolios
          </Link>
          <Link
            href="/portfolio/johndoe"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-800/60 text-blue-400 hover:text-blue-300 transition"
          >
            Live Showcase (@johndoe)
          </Link>
          <Link
            href="/#api-docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-800/60 hover:text-white transition"
          >
            API Specs
          </Link>
        </div>
      )}
    </header>
  );
}
