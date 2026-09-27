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

    if (typeof imageBase64 !== "string" || !imageBase64.startsWith("data:image/")) {
      return NextResponse.json({ error: "No image payload provided" }, { status: 400 });
    }

    if (imageBase64.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image payload must be smaller than 5 MB." }, { status: 413 });
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
