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
    const existing = await prisma.experience.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Experience record not found" }, { status: 404 });
    }

    if (existing.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this experience item." }, { status: 403 });
    }

    const body = await req.json();
    const { company, role, location, startDate, endDate, current, description, skillsUsed, order } = body;

    const updated = await prisma.experience.update({
      where: { id },
      data: {
        ...(company !== undefined && { company: String(company).trim() }),
        ...(role !== undefined && { role: String(role).trim() }),
        ...(location !== undefined && { location: String(location).trim() }),
        ...(startDate !== undefined && { startDate: String(startDate).trim() }),
        ...(endDate !== undefined && { endDate: current ? "Present" : String(endDate).trim() }),
        ...(current !== undefined && { current: Boolean(current) }),
        ...(description !== undefined && { description: String(description).trim() }),
        ...(skillsUsed !== undefined && { skillsUsed: JSON.stringify(Array.isArray(skillsUsed) ? skillsUsed : []) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    return NextResponse.json({
      message: "Experience updated successfully.",
      experience: {
        ...updated,
        skillsUsed: JSON.parse(updated.skillsUsed || "[]"),
      },
    });
  } catch (error) {
    console.error("Update experience error:", error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
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
    const existing = await prisma.experience.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    if (existing.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this experience item." }, { status: 403 });
    }

    await prisma.experience.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Experience deleted successfully." });
  } catch (error) {
    console.error("Delete experience error:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
