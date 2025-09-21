import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { cloudinary } from "@/configs/CloudinaryConfig";

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = body?.imagePrompt || "";
    const id = body?.id || uuidv4();

    if (!prompt) {
      return NextResponse.json(
        { error: "imagePrompt is required" },
        { status: 400 }
      );
    }

    console.log("🟢 Received prompt:", prompt);

    // ✅ Call SubNP AI Free API
    const response = await fetch("https://subnp.com/api/free/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model: "flux", // or "turbo", "magic"
        aspect_ratio: "1:1",
      }),
    });

    if (!response.ok || !response.body) {
      const errText = await response.text();
      throw new Error(`SubNP API error: ${errText}`);
    }

    // ✅ Parse SSE response stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let imageUrl = "";
    let debugLogs = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data:")) {
          try {
            const json = JSON.parse(line.replace("data: ", "").trim());

            debugLogs.push(json); // keep all logs

            // ✅ Capture final image URL (SubNP gives this)
            if (json.status === "complete" && json.imageUrl) {
              imageUrl = json.imageUrl;
            }

            // ✅ Handle error
            if (json.status === "error") {
              throw new Error(`SubNP error: ${json.message || "unknown"}`);
            }
          } catch (e) {
            console.error("⚠️ SSE parse error:", e, "line:", line);
          }
        }
      }
    }

    console.log("📜 Full SSE logs from SubNP:", debugLogs);

    if (!imageUrl) {
      throw new Error(
        "No image received from SubNP API. Check logs for details."
      );
    }

    // ✅ Fetch image binary from SubNP URL
    const imgResponse = await fetch(imageUrl);
    const arrayBuffer = await imgResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Upload to Cloudinary
    const fileUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "ai-generated-images",
          public_id: id,
          format: "png",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      uploadStream.end(buffer);
    });

    // ✅ Fetch usage stats
    let stats = {};
    try {
      const statsResponse = await fetch("https://subnp.com/api/free/stats");
      if (statsResponse.ok) {
        stats = await statsResponse.json();
      }
    } catch (e) {
      console.warn("Stats fetch failed:", e);
    }

    return NextResponse.json({
      message: "Image generated successfully",
      fileUrl, // cloudinary URL
      stats,
      debugLogs, // return logs for frontend debugging
    });
  } catch (err) {
    console.error("❌ Image generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
