import React from "react";
import Link from "next/link";
import { Layers, Code2, Globe, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070910] text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-blue-400">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-base text-white">FolioCraft</span>
              <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                Batch 02
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              Engineered for <strong>EncoderX Remote Internship (Full Stack Development - Task 3)</strong>.
              A modular platform for technical professionals to manage dynamic credentials, projects, and custom portfolio routes.
            </p>
            <div className="flex items-center gap-2.5 pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
                <Code2 className="w-3 h-3 text-blue-400" /> Next.js 14 & TypeScript
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
                <Globe className="w-3 h-3 text-emerald-400" /> SQLite & Prisma ORM
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium text-xs tracking-wider uppercase mb-3">Live Profiles</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/portfolio/johndoe" className="hover:text-blue-400 transition-colors">
                  /portfolio/johndoe (Full Stack)
                </Link>
              </li>
              <li>
                <Link href="/portfolio/sarahdev" className="hover:text-purple-400 transition-colors">
                  /portfolio/sarahdev (UI/UX)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Creator Studio Dashboard
                </Link>
              </li>
              <li>
                <Link href="/#api-docs" className="hover:text-white transition-colors">
                  Interactive REST API Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Program Info */}
          <div>
            <h4 className="text-white font-medium text-xs tracking-wider uppercase mb-3">Program Details</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Track: Full Stack Development</li>
              <li>Week: 03 (Portfolio Management System)</li>
              <li>Domain: Full Stack Architecture</li>
              <li className="text-[11px] text-slate-500 pt-1 font-mono">
                encoderxtech@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} FolioCraft Ecosystem. EncoderX Remote Internship Batch 02.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Modular Architecture</span>
            <span>•</span>
            <span>RESTful Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
