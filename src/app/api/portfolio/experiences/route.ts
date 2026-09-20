import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const experiences = await prisma.experience.findMany({
      where: { userId: session.id },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    const formatted = experiences.map((e) => ({
      ...e,
      skillsUsed: JSON.parse(e.skillsUsed || "[]"),
    }));

    return NextResponse.json({ experiences: formatted });
  } catch (error) {
    console.error("Get experiences error:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { company, role, location, startDate, endDate, current, description, skillsUsed } = body;

    if (!company || !role || !startDate) {
      return NextResponse.json({ error: "Company, role, and start date are required." }, { status: 400 });
    }

    const count = await prisma.experience.count({ where: { userId: session.id } });

    const experience = await prisma.experience.create({
      data: {
        userId: session.id,
        company: String(company).trim(),
        role: String(role).trim(),
        location: location ? String(location).trim() : "",
        startDate: String(startDate).trim(),
        endDate: current ? "Present" : (endDate ? String(endDate).trim() : "Present"),
        current: Boolean(current),
        description: description ? String(description).trim() : "",
        skillsUsed: JSON.stringify(Array.isArray(skillsUsed) ? skillsUsed : []),
        order: count + 1,
      },
    });

    return NextResponse.json(
      {
        message: "Experience created successfully.",
        experience: {
          ...experience,
          skillsUsed: JSON.parse(experience.skillsUsed || "[]"),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create experience error:", error);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}
