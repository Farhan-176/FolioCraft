import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password, fullName } = body;

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof fullName !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password ||
      !fullName.trim()
    ) {
      return NextResponse.json(
        { error: "Username, email, password, and full name are required." },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim()) || password.length < 8) {
      return NextResponse.json(
        { error: "Enter a valid email address and a password of at least 8 characters." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters and contain only letters, numbers, hyphens, and underscores." },
        { status: 400 }
      );
    }

    // Check if username or email exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username: cleanUsername }, { email: email.trim().toLowerCase() }],
      },
    });

    if (existing) {
      if (existing.username === cleanUsername) {
        return NextResponse.json({ error: "Username is already taken." }, { status: 409 });
      }
      return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: cleanUsername,
        email: email.trim().toLowerCase(),
        password: passwordHash,
        fullName: fullName.trim(),
        title: "Full Stack Developer",
        bio: "Passionate developer crafting modern web applications and scalable APIs.",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
        location: "Remote",
        status: "Available for hire",
        themeColor: "indigo",
        socialLinks: JSON.stringify({
          github: "",
          linkedin: "",
          twitter: "",
          website: "",
          email: email.trim().toLowerCase(),
        }),
      },
    });

    const token = signToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    const response = NextResponse.json(
      {
        message: "Account registered successfully.",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          title: user.title,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          themeColor: user.themeColor,
          status: user.status,
          socialLinks: JSON.parse(user.socialLinks),
        },
      },
      { status: 201 }
    );

    // Set HTTP-only cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error occurred during registration." }, { status: 500 });
  }
}
