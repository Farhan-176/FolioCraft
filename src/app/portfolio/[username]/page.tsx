"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  MapPin,
  Briefcase,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Copy,
  Code2,
  Terminal,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string | null;
  imageUrl: string;
  demoUrl: string;
  repoUrl: string;
  tags: string[];
  order: number;
  featured: boolean;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  skillsUsed: string[];
  order: number;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  order: number;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  title: string;
  bio: string;
  avatarUrl: string;
  location: string;
  status: string;
  themeColor: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    email?: string;
  };
}

interface PortfolioData {
  user: UserProfile;
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
}

// Professional Theme Color Palette Definitions
const themeColorMap: Record<string, {
  accent: string;
  bgGlow: string;
  borderGlow: string;
  badgeBg: string;
  buttonBg: string;
  solidAccent: string;
}> = {
  // 1. Tech Cobalt (Default / Clean Blue)
  cobalt: {
    accent: "text-blue-400",
    bgGlow: "rgba(59, 130, 246, 0.08)",
    borderGlow: "border-blue-500/25",
    badgeBg: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    buttonBg: "bg-blue-600 hover:bg-blue-500",
    solidAccent: "bg-blue-500",
  },
  cyan: {
    accent: "text-blue-400",
    bgGlow: "rgba(59, 130, 246, 0.08)",
    borderGlow: "border-blue-500/25",
    badgeBg: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    buttonBg: "bg-blue-600 hover:bg-blue-500",
    solidAccent: "bg-blue-500",
  },
  // 2. Precision Emerald (Fintech & Systems)
  emerald: {
    accent: "text-emerald-400",
    bgGlow: "rgba(16, 185, 129, 0.08)",
    borderGlow: "border-emerald-500/25",
    badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    buttonBg: "bg-emerald-600 hover:bg-emerald-500",
    solidAccent: "bg-emerald-500",
  },
  // 3. Nordic Teal
  teal: {
    accent: "text-teal-400",
    bgGlow: "rgba(20, 184, 166, 0.08)",
    borderGlow: "border-teal-500/25",
    badgeBg: "bg-teal-500/10 text-teal-300 border-teal-500/20",
    buttonBg: "bg-teal-600 hover:bg-teal-500",
    solidAccent: "bg-teal-500",
  },
  // 4. Executive Indigo
  indigo: {
    accent: "text-indigo-400",
    bgGlow: "rgba(99, 102, 241, 0.08)",
    borderGlow: "border-indigo-500/25",
    badgeBg: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    buttonBg: "bg-indigo-600 hover:bg-indigo-500",
    solidAccent: "bg-indigo-500",
  },
  violet: {
    accent: "text-indigo-400",
    bgGlow: "rgba(99, 102, 241, 0.08)",
    borderGlow: "border-indigo-500/25",
    badgeBg: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    buttonBg: "bg-indigo-600 hover:bg-indigo-500",
    solidAccent: "bg-indigo-500",
  },
  // 5. Warm Bronze / Amber
  amber: {
    accent: "text-amber-400",
    bgGlow: "rgba(245, 158, 11, 0.08)",
    borderGlow: "border-amber-500/25",
    badgeBg: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    buttonBg: "bg-amber-600 hover:bg-amber-500",
    solidAccent: "bg-amber-500",
  },
  // 6. Minimalist Titanium Slate
  slate: {
    accent: "text-slate-200",
    bgGlow: "rgba(148, 163, 184, 0.08)",
    borderGlow: "border-slate-500/25",
    badgeBg: "bg-slate-700/30 text-slate-200 border-slate-600/30",
    buttonBg: "bg-slate-700 hover:bg-slate-600",
    solidAccent: "bg-slate-400",
  },
  rose: {
    accent: "text-slate-200",
    bgGlow: "rgba(148, 163, 184, 0.08)",
    borderGlow: "border-slate-500/25",
    badgeBg: "bg-slate-700/30 text-slate-200 border-slate-600/30",
    buttonBg: "bg-slate-700 hover:bg-slate-600",
    solidAccent: "bg-slate-400",
  },
};

export default function PublicPortfolioPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        setLoading(true);
        const res = await fetch(`/api/portfolio/${username}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError(`User portfolio '@${username}' not found.`);
          } else {
            setError("Failed to load portfolio.");
          }
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Network error fetching public portfolio.");
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, [username]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090c15] flex flex-col items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-medium tracking-wider text-slate-400">Loading profile @{username}...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#090c15] flex flex-col items-center justify-center p-4 text-center">
        <div className="glass-panel p-8 rounded-2xl max-w-md border border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Portfolio Not Found</h1>
          <p className="text-xs text-slate-400 mb-6">{error || "Could not retrieve portfolio details."}</p>
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
            >
              Explore Existing Portfolios
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs transition"
            >
              Claim @{username} & Create Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { user, projects, experiences, skills } = data;
  const theme = themeColorMap[user.themeColor] || themeColorMap.cobalt;

  // Filter projects
  const filteredProjects =
    activeFilter === "all"
      ? projects
      : activeFilter === "featured"
      ? projects.filter((p) => p.featured)
      : projects.filter((p) => p.tags.some((t) => t.toLowerCase() === activeFilter.toLowerCase()));

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#090c15] text-slate-100 selection:bg-blue-600 selection:text-white relative">
      {/* Subtle Background Ambience */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] pointer-events-none opacity-50 blur-[130px]"
        style={{
          background: `radial-gradient(circle, ${theme.bgGlow} 0%, rgba(9, 12, 21, 0) 70%)`,
        }}
      />

      {/* Clean Floating Nav */}
      <header className="sticky top-4 z-40 max-w-4xl mx-auto px-4">
        <nav className="glass-panel px-5 py-3 rounded-xl border border-slate-800/80 shadow-xl flex items-center justify-between backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-white transition">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>FolioCraft</span>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href="#about" className="hover:text-slate-100 transition">About</a>
            <a href="#projects" className="hover:text-slate-100 transition">Projects</a>
            <a href="#experience" className="hover:text-slate-100 transition">Experience</a>
            <a href="#skills" className="hover:text-slate-100 transition">Skills</a>
            <a href="#contact" className="hover:text-slate-100 transition">Contact</a>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs transition"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Share"}</span>
            </button>
            <a
              href="#contact"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium text-white ${theme.buttonBg} transition shadow-sm`}
            >
              Contact
            </a>
          </div>
        </nav>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-24 space-y-16 relative z-10">
        {/* HERO / ABOUT SECTION */}
        <section id="about" className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-md">
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] text-emerald-400 font-medium flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{user.status || "Available"}</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 font-mono">
                <span>@{user.username}</span>
                {user.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {user.location}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                {user.fullName}
              </h1>

              <p className={`text-sm sm:text-base font-medium ${theme.accent}`}>
                {user.title}
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                {user.bio}
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                {user.socialLinks?.github && (
                  <a
                    href={user.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {user.socialLinks?.linkedin && (
                  <a
                    href={user.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-slate-700 transition"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {user.socialLinks?.twitter && (
                  <a
                    href={user.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Twitter / X"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-slate-700 transition"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {user.socialLinks?.website && (
                  <a
                    href={user.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Website"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-slate-700 transition"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {user.socialLinks?.email && (
                  <a
                    href={`mailto:${user.socialLinks.email}`}
                    title="Email"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <Code2 className={`w-3.5 h-3.5 ${theme.accent}`} />
                <span>Featured Engineering Work</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Key Projects</h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  activeFilter === "all"
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All ({projects.length})
              </button>
              <button
                onClick={() => setActiveFilter("featured")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  activeFilter === "featured"
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Featured
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                    activeFilter === tag
                      ? "bg-slate-800 text-white border border-slate-700"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center border border-slate-800 text-slate-500 text-xs">
              No projects in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="glass-card rounded-xl border border-slate-800/80 overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition"
                >
                  <div>
                    {/* Project Image */}
                    {proj.imageUrl && (
                      <div className="h-44 w-full overflow-hidden relative bg-slate-900">
                        <img
                          src={proj.imageUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {proj.featured && (
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-slate-200 font-medium text-[10px] uppercase tracking-wider">
                            Featured
                          </span>
                        )}
                      </div>
                    )}

                    <div className="p-5 space-y-2.5">
                      <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {proj.description}
                      </p>

                      {/* Tag badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {proj.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded border ${theme.badgeBg}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="px-5 py-3 border-t border-slate-800/70 bg-slate-900/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-200 hover:text-blue-400 transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Demo</span>
                        </a>
                      )}
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* WORK EXPERIENCE SECTION */}
        {experiences.length > 0 && (
          <section id="experience" className="space-y-6">
            <div className="border-b border-slate-800/80 pb-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <Briefcase className={`w-3.5 h-3.5 ${theme.accent}`} />
                <span>Career History</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Work Experience</h2>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline bullet */}
                  <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-slate-900 bg-slate-600 group-hover:bg-blue-400 transition-colors" />

                  <div className="glass-card rounded-xl p-5 border border-slate-800/80 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-white">{exp.role}</h3>
                        <div className="text-xs text-blue-400 font-medium">
                          {exp.company} {exp.location && `• ${exp.location}`}
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1 text-xs text-slate-400 font-mono">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{exp.startDate} — {exp.endDate}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {exp.description}
                    </p>

                    {exp.skillsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                        {exp.skillsUsed.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS SECTION */}
        {skills.length > 0 && (
          <section id="skills" className="space-y-6">
            <div className="border-b border-slate-800/80 pb-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <Terminal className={`w-3.5 h-3.5 ${theme.accent}`} />
                <span>Technical Capabilities</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Skills & Technologies</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Frontend", "Backend", "Database", "DevOps", "Tools"].map((category) => {
                const catSkills = skills.filter((s) => s.category === category);
                if (catSkills.length === 0) return null;
                return (
                  <div key={category} className="glass-card rounded-xl p-4 border border-slate-800/80 space-y-2.5">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {catSkills.map((sk) => (
                        <div
                          key={sk.id}
                          className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-1.5"
                        >
                          <span>{sk.name}</span>
                          <span className={`text-[9px] px-1 rounded ${theme.badgeBg}`}>
                            {sk.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* CONTACT SECTION */}
        <section id="contact" className="pt-4">
          <div className="glass-panel rounded-2xl p-8 sm:p-10 border border-slate-800 text-center relative">
            <div className="max-w-md mx-auto space-y-3">
              <span className={`text-xs font-semibold uppercase tracking-wider ${theme.accent}`}>
                Get In Touch
              </span>
              <h2 className="text-2xl font-bold text-white">Interested in collaborating?</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Whether you have an upcoming project, a engineering opportunity, or wish to connect, feel free to reach out.
              </p>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                {user.socialLinks?.email && (
                  <a
                    href={`mailto:${user.socialLinks.email}`}
                    className={`px-5 py-2.5 rounded-lg text-xs font-medium text-white ${theme.buttonBg} transition flex items-center gap-2 shadow-sm`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email {user.fullName.split(" ")[0]}</span>
                  </a>
                )}
                {user.socialLinks?.linkedin && (
                  <a
                    href={user.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex items-center gap-2"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Public Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070910] py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {user.fullName}. Built on FolioCraft.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Dynamic URL: <strong className="text-slate-200">/portfolio/{user.username}</strong></span>
            <Link href="/" className="hover:text-white transition">Platform Home →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
