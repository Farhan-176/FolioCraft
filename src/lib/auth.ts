import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be configured before starting the application.");
}

export interface TokenPayload {
  userId: string;
  username: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(req: NextRequest) {
  try {
    // Check Authorization Bearer header first
    const authHeader = req.headers.get("authorization");
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      // Check cookies
      const cookieToken = req.cookies.get("auth_token")?.value;
      if (cookieToken) {
        token = cookieToken;
      }
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
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
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    return {
      ...user,
      socialLinks: JSON.parse(user.socialLinks || "{}"),
    };
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}
