import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const skills = await prisma.skill.findMany({
      where: { userId: session.id },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("Get skills error:", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, category, level } = body;

    if (!name) {
      return NextResponse.json({ error: "Skill name is required." }, { status: 400 });
    }

    const count = await prisma.skill.count({ where: { userId: session.id } });

    const skill = await prisma.skill.create({
      data: {
        userId: session.id,
        name: String(name).trim(),
        category: category || "Frontend",
        level: level || "Advanced",
        order: count + 1,
      },
    });

    return NextResponse.json(
      { message: "Skill added successfully.", skill },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add skill error:", error);
    return NextResponse.json({ error: "Failed to add skill" }, { status: 500 });
  }
}
