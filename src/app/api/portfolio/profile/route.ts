import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in to update your profile." }, { status: 401 });
    }

    const body = await req.json();
    const {
      fullName,
      title,
      bio,
      avatarUrl,
      location,
      status,
      themeColor,
      socialLinks,
    } = body;

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: {
        ...(fullName !== undefined && { fullName: String(fullName).trim() }),
        ...(title !== undefined && { title: String(title).trim() }),
        ...(bio !== undefined && { bio: String(bio).trim() }),
        ...(avatarUrl !== undefined && { avatarUrl: String(avatarUrl).trim() }),
        ...(location !== undefined && { location: String(location).trim() }),
        ...(status !== undefined && { status: String(status).trim() }),
        ...(themeColor !== undefined && { themeColor: String(themeColor).trim() }),
        ...(socialLinks !== undefined && { socialLinks: JSON.stringify(socialLinks) }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        title: true,
        bio: true,
        avatarUrl: true,
        location: true,
        status: true,
        themeColor: true,
        socialLinks: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: {
        ...updated,
        socialLinks: JSON.parse(updated.socialLinks || "{}"),
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
