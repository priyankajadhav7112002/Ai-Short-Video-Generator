import { NextResponse } from "next/server";
import googleTTS from "google-tts-api";
import { v4 as uuidv4 } from "uuid";
import { cloudinary } from "@/configs/CloudinaryConfig";
import streamifier from "streamifier"


export const runtime = "nodejs"; // required for fs support

// Google TTS has a ~200 char limit per request, so we chunk long text.
function chunkText(str, maxLen = 200) {
  const words = str.trim().split(/\s+/);
  const chunks = [];
  let current = "";

  for (const w of words) {
    if ((current + " " + w).trim().length > maxLen) {
      if (current) chunks.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const text = (body?.text || "").trim();
    const lang = body?.lang || "en";
    const slow = !!body?.slow;
    const id = body?.id || uuidv4();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Build MP3 by concatenating chunked MP3 parts
    const chunks = chunkText(text, 200);
    const buffers = [];

    for (const part of chunks) {
      const url = googleTTS.getAudioUrl(part, { lang, slow });
      const res = await fetch(url);
      if (!res.ok) throw new Error(`TTS fetch failed: ${res.status}`);
      const arrBuf = await res.arrayBuffer();
      buffers.push(Buffer.from(arrBuf));
    }

    const mp3Buffer = Buffer.concat(buffers);

    // 🔹 Upload to Cloudinary
 const fileUrl = await new Promise((resolve, reject) => {
   const uploadStream = cloudinary.uploader.upload_stream(
      {
          resource_type: "video", // ✅ IMPORTANT: audio files should use "video"
          folder: "ai-short-video-files", // optional folder
          public_id: id,
          format: "mp3",
        },
     (error, result) => {
       if (error) reject(error);
       else resolve(result.secure_url);
     }
   );

   streamifier.createReadStream(mp3Buffer).pipe(uploadStream);
 });

 return NextResponse.json({
   message: "MP3 file generated successfully",
   fileUrl,
 });
 } catch (err) {
    console.error("TTS error:", err);
    return NextResponse.json({ error: err.message || "TTS failed" }, { status: 500 });
  }
}