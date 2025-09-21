import { bundle } from "@remotion/bundler";
const { getCompositions, renderMedia } = require("@remotion/renderer");
import path from "path";
import os from "os";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { videoData } = req.body;
    const duration = Number(videoData?.durationInFrame) || 600; // fallback to 600 frames (20s)
    if (!Number.isFinite(duration) || duration <= 0) {
      res.status(400).json({ error: "Invalid durationInFrame" });
      return;
    }

    // 1. Bundle Remotion project
    const entry = path.join(process.cwd(), "remotion", "index.jsx");
    const bundleLocation = await bundle(entry);

    // 2. Render video to temp file
    const tmpFile = path.join(os.tmpdir(), `out-${Date.now()}.mp4`);
    

    const comps = await getCompositions(bundleLocation, {
    inputProps: {
        ...videoData,
        durationInFrame: duration,
    },
    });

    const videoComp = comps.find((c) => c.id === "MyVideo");

    await renderMedia({
    composition: videoComp, // 👈 instead of just "MyVideo"
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: tmpFile,
    inputProps: {
        ...videoData,
        durationInFrame: duration,
    },
    });
    // 3. Return buffer
    const fileBuffer = fs.readFileSync(tmpFile);
    fs.unlinkSync(tmpFile);

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
    res.status(200).send(fileBuffer);
  } catch (err) {
    console.error("Export failed:", err);
    res.status(500).json({ error: err.message });
  }
}