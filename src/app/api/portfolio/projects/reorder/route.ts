import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body; // [{ id: string, order: number }]

    if (
      !Array.isArray(items) ||
      items.length > 100 ||
      items.some(
        (item) =>
          !item ||
          typeof item.id !== "string" ||
          !Number.isInteger(item.order) ||
          item.order < 1
      )
    ) {
      return NextResponse.json({ error: "Invalid payload: items must be an array" }, { status: 400 });
    }

    const ownedProjects = await prisma.project.findMany({
      where: { userId: session.id, id: { in: items.map((item) => item.id) } },
      select: { id: true },
    });
    const ownedIds = new Set(ownedProjects.map((project) => project.id));

    if (ownedIds.size !== items.length || items.some((item) => !ownedIds.has(item.id))) {
      return NextResponse.json({ error: "One or more projects are not owned by the current user." }, { status: 403 });
    }

    // Update orders in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.project.updateMany({
          where: { id: item.id, userId: session.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ message: "Projects reordered successfully." });
  } catch (error) {
    console.error("Reorder projects error:", error);
    return NextResponse.json({ error: "Failed to reorder projects" }, { status: 500 });
  }
}
