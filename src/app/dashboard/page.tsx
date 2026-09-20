"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Briefcase,
  Layers,
  Palette,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Save,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Share2,
  Eye,
  AlertCircle,
  Copy,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "experiences" | "skills" | "theme">("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // User State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    longDescription: "",
    imageUrl: "",
    demoUrl: "",
    repoUrl: "",
    tags: "",
    featured: false,
  });

  // Experience Modal State
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expForm, setExpForm] = useState({
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    skillsUsed: "",
  });

  // Skill Form State
  const [skillForm, setSkillForm] = useState({
    name: "",
    category: "Frontend",
    level: "Advanced",
  });

  // Load User Data
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const authRes = await fetch("/api/auth/me");
        if (!authRes.ok) {
          router.push("/login");
          return;
        }
        const authData = await authRes.json();
        const username = authData.user.username;

        // Fetch full portfolio details
        const portRes = await fetch(`/api/portfolio/${username}`);
        if (portRes.ok) {
          const data = await portRes.json();
          setProfile(data.user);
          setProjects(data.projects || []);
          setExperiences(data.experiences || []);
          setSkills(data.skills || []);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [router]);

  const showNotification = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // 1. Profile Update
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    try {
      const res = await fetch("/api/portfolio/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profile.fullName,
          title: profile.title,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          location: profile.location,
          status: profile.status,
          themeColor: profile.themeColor,
          socialLinks: profile.socialLinks,
        }),
      });

      if (!res.ok) throw new Error("Failed to save profile changes.");
      showNotification("success", "Profile updated successfully!");
    } catch (err: any) {
      showNotification("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  // 2. Project Handlers
  const handleOpenProjectModal = (proj?: Project) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({
        title: proj.title,
        description: proj.description,
        longDescription: proj.longDescription || "",
        imageUrl: proj.imageUrl,
        demoUrl: proj.demoUrl,
        repoUrl: proj.repoUrl,
        tags: proj.tags.join(", "),
        featured: proj.featured,
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        title: "",
        description: "",
        longDescription: "",
        imageUrl: "",
        demoUrl: "",
        repoUrl: "",
        tags: "",
        featured: false,
      });
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...projectForm,
      tags: projectForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editingProject) {
        // Edit existing
        const res = await fetch(`/api/portfolio/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update project.");
        const data = await res.json();
        setProjects(projects.map((p) => (p.id === editingProject.id ? data.project : p)));
        showNotification("success", "Project updated successfully!");
      } else {
        // Create new
        const res = await fetch("/api/portfolio/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create project.");
        const data = await res.json();
        setProjects([...projects, data.project]);
        showNotification("success", "New project added to portfolio!");
      }
      setIsProjectModalOpen(false);
    } catch (err: any) {
      showNotification("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/portfolio/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project.");
      setProjects(projects.filter((p) => p.id !== id));
      showNotification("success", "Project deleted.");
    } catch (err: any) {
      showNotification("error", err.message);
    }
  };

  const handleReorderProject = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    const reordered = newProjects.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProjects(reordered);

    try {
      await fetch("/api/portfolio/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: reordered.map((p) => ({ id: p.id, order: p.order })),
        }),
      });
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  // 3. Experience Handlers
  const handleOpenExpModal = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setExpForm({
        company: exp.company,
        role: exp.role,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.current,
        description: exp.description,
        skillsUsed: exp.skillsUsed.join(", "),
      });
    } else {
      setEditingExp(null);
      setExpForm({
        company: "",
        role: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        skillsUsed: "",
      });
    }
    setIsExpModalOpen(true);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...expForm,
      skillsUsed: expForm.skillsUsed
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingExp) {
        const res = await fetch(`/api/portfolio/experiences/${editingExp.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update experience.");
        const data = await res.json();
        setExperiences(experiences.map((e) => (e.id === editingExp.id ? data.experience : e)));
        showNotification("success", "Work experience updated!");
      } else {
        const res = await fetch("/api/portfolio/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to add experience.");
        const data = await res.json();
        setExperiences([...experiences, data.experience]);
        showNotification("success", "Work experience added!");
      }
      setIsExpModalOpen(false);
    } catch (err: any) {
      showNotification("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!confirm("Delete this experience record?")) return;
    try {
      const res = await fetch(`/api/portfolio/experiences/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete experience.");
      setExperiences(experiences.filter((e) => e.id !== id));
      showNotification("success", "Experience removed.");
    } catch (err: any) {
      showNotification("error", err.message);
    }
  };

  // 4. Skill Handlers
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;
    try {
      const res = await fetch("/api/portfolio/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillForm),
      });
      if (!res.ok) throw new Error("Failed to add skill.");
      const data = await res.json();
      setSkills([...skills, data.skill]);
      setSkillForm({ ...skillForm, name: "" });
      showNotification("success", "Skill added!");
    } catch (err: any) {
      showNotification("error", err.message);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/skills/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete skill.");
      setSkills(skills.filter((s) => s.id !== id));
      showNotification("success", "Skill removed.");
    } catch (err: any) {
      showNotification("error", err.message);
    }
  };

  const copyPublicUrl = () => {
    if (!profile) return;
    const url = `${window.location.origin}/portfolio/${profile.username}`;
    navigator.clipboard.writeText(url);
    showNotification("success", `Copied public link: ${url}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#090d16]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading Creator Studio...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar />

      {/* Top Bar Header */}
      <div className="border-b border-slate-800 bg-[#0c121e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
                alt={profile.fullName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg shadow-indigo-500/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{profile.fullName}</h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                    Creator Dashboard
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
                  <span>@{profile.username}</span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {profile.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={copyPublicUrl}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Link</span>
              </button>
              <Link
                href={`/portfolio/${profile.username}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Public URL</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "profile", label: "Profile & Bio", icon: User },
              { id: "projects", label: `Projects (${projects.length})`, icon: Layers },
              { id: "experiences", label: `Work Timeline (${experiences.length})`, icon: Briefcase },
              { id: "skills", label: `Skills (${skills.length})`, icon: Sparkles },
              { id: "theme", label: "Theme Customizer", icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notifications Toast */}
      {message && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-medium transition-all ${
            message.type === "success"
              ? "bg-emerald-950/90 border border-emerald-500/40 text-emerald-200"
              : "bg-red-950/90 border border-red-500/40 text-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: PROFILE */}
        {activeTab === "profile" && (
          <div className="max-w-4xl">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800">
              <div className="border-b border-slate-800/80 pb-4 mb-6">
                <h2 className="text-lg font-bold text-white">Public Profile Details</h2>
                <p className="text-xs text-slate-400 mt-1">
                  This information is displayed prominently in your public portfolio header and about section.
                </p>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Professional Title</label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Avatar Image URL</label>
                    <input
                      type="text"
                      value={profile.avatarUrl}
                      onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA / Remote"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Availability Status</label>
                    <input
                      type="text"
                      value={profile.status}
                      onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                      placeholder="e.g. Available for high-impact roles"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Biography & Summary</label>
                    <textarea
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Write an engaging introduction about your background, passions, and technical expertise..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="border-t border-slate-800/80 pt-6">
                  <h3 className="text-sm font-semibold text-white mb-3">Social & Contact Links</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5 text-slate-400" /> GitHub URL
                      </label>
                      <input
                        type="text"
                        value={profile.socialLinks?.github || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            socialLinks: { ...profile.socialLinks, github: e.target.value },
                          })
                        }
                        placeholder="https://github.com/..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                        <Linkedin className="w-3.5 h-3.5 text-cyan-400" /> LinkedIn URL
                      </label>
                      <input
                        type="text"
                        value={profile.socialLinks?.linkedin || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            socialLinks: { ...profile.socialLinks, linkedin: e.target.value },
                          })
                        }
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                        <Twitter className="w-3.5 h-3.5 text-blue-400" /> Twitter / X URL
                      </label>
                      <input
                        type="text"
                        value={profile.socialLinks?.twitter || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            socialLinks: { ...profile.socialLinks, twitter: e.target.value },
                          })
                        }
                        placeholder="https://x.com/..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-emerald-400" /> Personal Website
                      </label>
                      <input
                        type="text"
                        value={profile.socialLinks?.website || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            socialLinks: { ...profile.socialLinks, website: e.target.value },
                          })
                        }
                        placeholder="https://..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium shadow-sm transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? "Saving..." : "Save Profile Details"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS */}
        {activeTab === "projects" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Project Showcase Studio</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add, edit, delete, and reorder projects displayed on your public portfolio.
                </p>
              </div>
              <button
                onClick={() => handleOpenProjectModal()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
                <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-white">No projects added yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Click the button below to showcase your high-impact work, repositories, and applications.
                </p>
                <button
                  onClick={() => handleOpenProjectModal()}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Add First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj, idx) => (
                  <div key={proj.id} className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                    <div>
                      {proj.imageUrl && (
                        <div className="h-40 rounded-xl overflow-hidden mb-4 relative group">
                          <img
                            src={proj.imageUrl}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {proj.featured && (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 font-bold text-[10px] uppercase">
                              Featured
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-white">{proj.title}</h3>
                        <span className="text-[11px] font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          #{idx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{proj.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {proj.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-indigo-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions & Reorder */}
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-5">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleReorderProject(idx, "up")}
                          title="Move Up"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === projects.length - 1}
                          onClick={() => handleReorderProject(idx, "down")}
                          title="Move Down"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenProjectModal(proj)}
                          className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition text-xs flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WORK TIMELINE */}
        {activeTab === "experiences" && (
          <div className="max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Work Experience & Roles</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage your career timeline, achievements, and technology tools used in each role.
                </p>
              </div>
              <button
                onClick={() => handleOpenExpModal()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Position</span>
              </button>
            </div>

            {experiences.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-white">No experience added yet</h3>
                <p className="text-xs text-slate-400 mt-1">Add previous employment, internships, or freelance roles.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="glass-card rounded-2xl p-5 border border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{exp.role}</h3>
                          {exp.current && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-blue-400 font-medium mt-0.5">
                          {exp.company} {exp.location && `• ${exp.location}`}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 font-mono">
                          {exp.startDate} — {exp.endDate}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenExpModal(exp)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExp(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">{exp.description}</p>

                    {exp.skillsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/60">
                        {exp.skillsUsed.map((sk, sIdx) => (
                          <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SKILLS */}
        {activeTab === "skills" && (
          <div className="max-w-4xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white">Skills Matrix & Technical Stack</h2>
              <p className="text-xs text-slate-400 mt-1">
                Showcase your technical competencies categorized by discipline with proficiency levels.
              </p>
            </div>

            {/* Add Skill Form */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 mb-6">
              <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row items-end gap-3">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Skill Name</label>
                  <input
                    type="text"
                    required
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    placeholder="e.g. Next.js, Docker, GraphQL"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="w-full sm:w-44">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>

                <div className="w-full sm:w-36">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Proficiency</label>
                  <select
                    value={skillForm.level}
                    onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </button>
              </form>
            </div>

            {/* Categorized Skills View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Frontend", "Backend", "Database", "DevOps", "Tools"].map((category) => {
                const categorySkills = skills.filter((s) => s.category === category);
                return (
                  <div key={category} className="glass-card rounded-2xl p-4 border border-slate-800">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>{category}</span>
                      <span className="text-[10px] text-slate-500">({categorySkills.length})</span>
                    </h3>
                    {categorySkills.length === 0 ? (
                      <p className="text-xs text-slate-600 italic">No {category.toLowerCase()} skills yet</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 group hover:border-slate-700"
                          >
                            <span>{skill.name}</span>
                            <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-1 rounded">
                              {skill.level}
                            </span>
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition ml-0.5"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: THEME CUSTOMIZER */}
        {activeTab === "theme" && (
          <div className="max-w-3xl">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800">
              <div className="border-b border-slate-800/80 pb-4 mb-6">
                <h2 className="text-lg font-bold text-white">Dynamic Accent Theme Engine</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Choose your public portfolio brand color. All buttons, highlights, badges, and glows adapt instantly.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { id: "cobalt", name: "Tech Cobalt", from: "from-blue-600", to: "to-indigo-600", desc: "Engineering Blue" },
                  { id: "emerald", name: "Precision Emerald", from: "from-emerald-600", to: "to-teal-700", desc: "Systems & Fintech" },
                  { id: "teal", name: "Nordic Teal", from: "from-teal-600", to: "to-cyan-700", desc: "Nordic Modern" },
                  { id: "indigo", name: "Executive Indigo", from: "from-indigo-600", to: "to-blue-700", desc: "Enterprise Cloud" },
                  { id: "amber", name: "Warm Bronze", from: "from-amber-600", to: "to-yellow-700", desc: "Product Architecture" },
                  { id: "slate", name: "Minimalist Slate", from: "from-slate-600", to: "to-slate-800", desc: "Monochrome Titanium" },
                ].map((palette) => {
                  const isSelected = profile.themeColor === palette.id || (profile.themeColor === "cyan" && palette.id === "cobalt") || (profile.themeColor === "violet" && palette.id === "indigo");
                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, themeColor: palette.id })}
                      className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${
                        isSelected
                          ? "border-blue-500 bg-slate-800/90 shadow-md"
                          : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${palette.from} ${palette.to} shadow-sm`} />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div className="text-xs font-semibold text-white">{palette.name}</div>
                      <div className="text-[10px] text-slate-500">{palette.desc}</div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <span className="text-xs text-slate-400">
                  Current Selected Theme: <strong className="text-white uppercase">{profile.themeColor}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleProfileSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium shadow-sm transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving Theme..." : "Apply Theme to Public Profile"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingProject ? "Edit Project" : "Add New Project"}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. CloudFlow Distributed Orchestrator"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Concise overview of what the project solves and key value..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Project Banner / Media Image URL</label>
                <input
                  type="text"
                  value={projectForm.imageUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Live Demo URL</label>
                  <input
                    type="text"
                    value={projectForm.demoUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub Repo URL</label>
                  <input
                    type="text"
                    value={projectForm.repoUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Technology Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  placeholder="React, Next.js, TypeScript, TailwindCSS"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-800 focus:ring-0"
                />
                <label htmlFor="featuredCheck" className="text-xs text-slate-300 font-medium">
                  Feature this project prominently in public portfolio
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
                >
                  {saving ? "Saving..." : editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPERIENCE MODAL */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingExp ? "Edit Experience" : "Add Work Experience"}
            </h3>

            <form onSubmit={handleSaveExp} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    placeholder="e.g. TechNova Labs"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Role / Title</label>
                  <input
                    type="text"
                    required
                    value={expForm.role}
                    onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    placeholder="e.g. Senior Software Architect"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={expForm.location}
                  onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA / Remote"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Start Date</label>
                  <input
                    type="text"
                    required
                    value={expForm.startDate}
                    onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                    placeholder="e.g. Jan 2023"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">End Date</label>
                  <input
                    type="text"
                    disabled={expForm.current}
                    value={expForm.current ? "Present" : expForm.endDate}
                    onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                    placeholder="e.g. Present"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="currentJobCheck"
                  checked={expForm.current}
                  onChange={(e) => setExpForm({ ...expForm, current: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-800 focus:ring-0"
                />
                <label htmlFor="currentJobCheck" className="text-xs text-slate-300 font-medium">
                  I currently work here
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Role Overview & Achievements</label>
                <textarea
                  rows={3}
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  placeholder="Key contributions, metrics improved, architecture designs delivered..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Skills Used (Comma Separated)
                </label>
                <input
                  type="text"
                  value={expForm.skillsUsed}
                  onChange={(e) => setExpForm({ ...expForm, skillsUsed: e.target.value })}
                  placeholder="Next.js, TypeScript, AWS, Docker"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
                >
                  {saving ? "Saving..." : editingExp ? "Save Changes" : "Add Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
