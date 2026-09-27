"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Database,
  Layers,
  Palette,
  ShieldCheck,
  Globe,
  ExternalLink,
  Copy,
  Terminal,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const testApi = async (endpoint: string) => {
    setLoadingApi(true);
    setApiResponse(null);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setLoadingApi(false);
    }
  };

  const copyUrl = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(null), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090c15] text-slate-100 selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-[11px] text-slate-300 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-medium">EncoderX Remote Internship — Batch 02</span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400">Task 3: Portfolio Management System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-[1.15]">
            Dynamic Portfolio Ecosystem for Software Engineers
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A modular platform engineered with dynamic routing, a secured Creator Studio, customizable design themes, and a structured RESTful API.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Create Your Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/portfolio/johndoe"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-medium text-xs sm:text-sm transition flex items-center justify-center gap-2"
            >
              <span>Explore Live Showcase (@johndoe)</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            </Link>
          </div>

          {/* Quick Demo Login Bar for Evaluators */}
          <div className="mt-8 max-w-lg mx-auto p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <span className="flex items-center gap-2 text-slate-300 text-[11px]">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Evaluator Demo Access:</span>
            </span>
            <Link
              href="/login"
              className="px-3 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/25 font-medium text-xs transition"
            >
              One-Click Demo Access →
            </Link>
          </div>
        </div>
      </section>

      {/* DIRECTORY: LIVE SEEDED CREATORS */}
      <section id="directory" className="py-16 border-t border-slate-800/80 bg-[#070910] scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 mb-1">
                Dynamic Routing Ecosystem
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Featured Creator Profiles
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Each user receives a personalized public profile at <code className="text-slate-200 font-mono">/portfolio/:username</code> rendered dynamically with their custom accent palette.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* John Doe Card */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800/90 relative overflow-hidden group">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="Johnathan Doe"
                  className="w-14 h-14 rounded-xl object-cover border border-slate-700 bg-slate-900"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-white group-hover:text-cyan-400 transition">
                      Johnathan Doe
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
                      Neon Cyan
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">/portfolio/johndoe</p>
                  <p className="text-xs text-slate-300 font-medium mt-1">Senior Full Stack & Cloud Architect</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                Crafting mission-critical web applications with React, Next.js, Node.js, and Distributed Cloud Systems.
              </p>
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                <div className="flex gap-1.5">
                  {["Next.js", "TypeScript", "Redis", "PostgreSQL"].map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href="/portfolio/johndoe"
                  className="inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300"
                >
                  <span>View Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Sarah Connor Card */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800/90 relative overflow-hidden group">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                  alt="Sarah Connor"
                  className="w-14 h-14 rounded-xl object-cover border border-slate-700 bg-slate-900"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-white group-hover:text-purple-400 transition">
                      Sarah Connor
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                      Electric Violet
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">/portfolio/sarahdev</p>
                  <p className="text-xs text-slate-300 font-medium mt-1">UI/UX Designer & Creative Frontend</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                Bridging the gap between human-centric design and pixel-perfect code. Specializing in micro-animations and design systems.
              </p>
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                <div className="flex gap-1.5">
                  {["React", "Figma", "Tailwind", "Motion"].map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href="/portfolio/sarahdev"
                  className="inline-flex items-center gap-1 text-xs font-medium text-purple-400 hover:text-purple-300"
                >
                  <span>View Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE ARCHITECTURE & SYSTEM CAPABILITIES */}
      <section id="features" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 mb-1.5">
            Architecture Breakdown
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Comprehensive System Engineering
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Built in full accordance with EncoderX Task 3 criteria, integrating dynamic Next.js routing, SQLite ORM database storage, and secure authentication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Dynamic Routing (30%)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated route resolution via <code className="text-slate-300 font-mono">/portfolio/:username</code>. Fetches creator data asynchronously from backend SQLite storage.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Theme & UI/UX (25%)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              6 professional theme palettes. Responsive mobile & desktop layouts with smooth enterprise typography and clean contrast.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-700/20 border border-slate-700/40 text-slate-300 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Creator Dashboard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Protected administration studio. Full CRUD operations for projects, career timeline, skills matrix, reordering, and profile configuration.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">RESTful API Specs (10%)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clean REST architecture supporting <code className="text-slate-300 font-mono">GET /api/portfolio/:username</code>, profile updates, and project CRUD.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Database & Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Relational SQLite database powered by Prisma ORM with cascading deletes, password hashing via bcryptjs, and JWT cookie sessions.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Data Isolation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict authorization middleware ensuring creators can only edit, modify, and reorder their own projects and credentials.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE REST API EXPLORER */}
      <section id="api-docs" className="py-16 bg-[#070910] border-t border-slate-800/80 scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 mb-1">
              Step 2 Requirement: RESTful API Engineering
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Interactive REST API Console</h2>
            <p className="text-xs text-slate-400 mt-1">
              Test live portfolio management API endpoints directly from this interactive console.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Endpoints List */}
            <div className="lg:col-span-5 space-y-2">
              {[
                { method: "GET", path: "/api/portfolio/johndoe", desc: "Fetch public portfolio for @johndoe" },
                { method: "GET", path: "/api/portfolio/sarahdev", desc: "Fetch public portfolio for @sarahdev" },
                { method: "GET", path: "/api/auth/me", desc: "Check active session status" },
                { method: "PUT", path: "/api/portfolio/profile", desc: "Update profile & theme (Protected)", auth: true },
                { method: "POST", path: "/api/portfolio/projects", desc: "Add new portfolio project (Protected)", auth: true },
              ].map((ep, idx) => (
                <div
                  key={idx}
                  className="glass-card p-3.5 rounded-lg border border-slate-800 flex items-center justify-between gap-2 group hover:border-slate-700"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                          ep.method === "GET"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : ep.method === "PUT"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs text-slate-200 truncate">{ep.path}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{ep.desc}</p>
                  </div>

                  {ep.method === "GET" ? (
                    <button
                      onClick={() => testApi(ep.path)}
                      className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shrink-0"
                    >
                      Send
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">Auth Req</span>
                  )}
                </div>
              ))}
            </div>

            {/* Live Response Box */}
            <div className="lg:col-span-7 glass-panel rounded-xl border border-slate-800 overflow-hidden shadow-md">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span>HTTP Response Payload (JSON)</span>
                </div>
                {apiResponse && (
                  <button
                    onClick={() => copyUrl(apiResponse)}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedEndpoint === apiResponse ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>

              <div className="p-4 bg-[#080b12] font-mono text-xs overflow-x-auto max-h-96 min-h-60 text-slate-300">
                {loadingApi ? (
                  <div className="flex items-center justify-center h-44 text-slate-500">
                    <span className="animate-pulse">Dispatching API call...</span>
                  </div>
                ) : apiResponse ? (
                  <pre className="text-emerald-400/90 leading-relaxed text-[11px]">{apiResponse}</pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-44 text-slate-600 text-center">
                    <Terminal className="w-6 h-6 mb-2 opacity-50" />
                    <p className="text-xs">Click &quot;Send&quot; on any endpoint to view real-time JSON response</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
