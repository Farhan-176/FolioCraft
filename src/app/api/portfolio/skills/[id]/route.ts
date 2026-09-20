import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

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
    const existing = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    if (existing.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this skill item." }, { status: 403 });
    }

    await prisma.skill.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Skill removed successfully." });
  } catch (error) {
    console.error("Delete skill error:", error);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
