import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.id },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    const formatted = projects.map((p) => ({
      ...p,
      tags: JSON.parse(p.tags || "[]"),
    }));

    return NextResponse.json({ projects: formatted });
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, longDescription, imageUrl, demoUrl, repoUrl, tags, featured } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
    }

    // Determine the next order index
    const count = await prisma.project.count({
      where: { userId: session.id },
    });

    const project = await prisma.project.create({
      data: {
        userId: session.id,
        title: String(title).trim(),
        description: String(description).trim(),
        longDescription: longDescription ? String(longDescription).trim() : null,
        imageUrl: imageUrl ? String(imageUrl).trim() : "",
        demoUrl: demoUrl ? String(demoUrl).trim() : "",
        repoUrl: repoUrl ? String(repoUrl).trim() : "",
        tags: JSON.stringify(Array.isArray(tags) ? tags : []),
        order: count + 1,
        featured: Boolean(featured),
      },
    });

    return NextResponse.json(
      {
        message: "Project created successfully.",
        project: {
          ...project,
          tags: JSON.parse(project.tags || "[]"),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
