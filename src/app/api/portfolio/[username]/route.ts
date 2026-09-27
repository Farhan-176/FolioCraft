import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    if (!username) {
      return NextResponse.json({ error: "Username parameter is required." }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { username: cleanUsername },
      select: {
        id: true,
        username: true,
        fullName: true,
        title: true,
        bio: true,
        avatarUrl: true,
        location: true,
        status: true,
        themeColor: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true,
        projects: {
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        },
        experiences: {
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        },
        skills: {
          orderBy: [{ order: "asc" }, { name: "asc" }],
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: `Portfolio for user '${cleanUsername}' not found.` }, { status: 404 });
    }

    // Format fields with JSON parsing safely
    const formattedProjects = user.projects.map((proj) => {
      let parsedTags: string[] = [];
      try {
        parsedTags = JSON.parse(proj.tags || "[]");
      } catch {
        parsedTags = [];
      }
      return {
        ...proj,
        tags: parsedTags,
      };
    });

    const formattedExperiences = user.experiences.map((exp) => {
      let parsedSkills: string[] = [];
      try {
        parsedSkills = JSON.parse(exp.skillsUsed || "[]");
      } catch {
        parsedSkills = [];
      }
      return {
        ...exp,
        skillsUsed: parsedSkills,
      };
    });

    let parsedSocialLinks = {};
    try {
      parsedSocialLinks = JSON.parse(user.socialLinks || "{}");
    } catch {
      parsedSocialLinks = {};
    }

    const portfolioData = {
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        title: user.title,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        location: user.location,
        status: user.status,
        themeColor: user.themeColor,
        socialLinks: parsedSocialLinks,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      projects: formattedProjects,
      experiences: formattedExperiences,
      skills: user.skills,
    };

    return NextResponse.json(portfolioData, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Fetch portfolio error:", error);
    return NextResponse.json({ error: "Internal server error fetching portfolio." }, { status: 500 });
  }
}
