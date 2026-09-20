import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (existing.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this project." }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, longDescription, imageUrl, demoUrl, repoUrl, tags, featured, order } = body;

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        ...(description !== undefined && { description: String(description).trim() }),
        ...(longDescription !== undefined && { longDescription: longDescription ? String(longDescription).trim() : null }),
        ...(imageUrl !== undefined && { imageUrl: String(imageUrl).trim() }),
        ...(demoUrl !== undefined && { demoUrl: String(demoUrl).trim() }),
        ...(repoUrl !== undefined && { repoUrl: String(repoUrl).trim() }),
        ...(tags !== undefined && { tags: JSON.stringify(Array.isArray(tags) ? tags : []) }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    return NextResponse.json({
      message: "Project updated successfully.",
      project: {
        ...updated,
        tags: JSON.parse(updated.tags || "[]"),
      },
    });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (existing.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this project." }, { status: 403 });
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
