import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { imageBase64, filename } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: "No image payload provided" }, { status: 400 });
    }

    // Since SQLite stores strings cleanly, or direct data URLs:
    // Base64 data URLs work out of the box without requiring S3/cloud storage setup
    return NextResponse.json({
      url: imageBase64,
      filename: filename || "uploaded_media",
      message: "Media processed successfully.",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Media upload failed." }, { status: 500 });
  }
}
