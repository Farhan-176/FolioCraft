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

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload: items must be an array" }, { status: 400 });
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
