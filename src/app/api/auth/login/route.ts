import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { login, password } = body;

    if (typeof login !== "string" || typeof password !== "string" || !login.trim() || !password) {
      return NextResponse.json(
        { error: "Username/Email and password are required." },
        { status: 400 }
      );
    }

    const cleanLogin = login.trim().toLowerCase();

    // Find by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: cleanLogin }, { email: cleanLogin }],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    const response = NextResponse.json({
      message: "Logged in successfully.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        title: user.title,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        location: user.location,
        status: user.status,
        themeColor: user.themeColor,
        socialLinks: JSON.parse(user.socialLinks || "{}"),
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error occurred during login." }, { status: 500 });
  }
}
