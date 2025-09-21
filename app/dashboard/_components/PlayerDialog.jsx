import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import { VideoData } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { db } from "@/configs/db";

function PlayerDialog({ playVideo, videoId, onClose }) {
  const [videoData, setVideoData] = useState();
  const [durationInFrame, setDurationInFrame] = useState(100);
  const router = useRouter();

  useEffect(() => {
    if (videoId) {
      GetVideoData();
    }
  }, [videoId]);

  const GetVideoData = async () => {
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.id, videoId));

    setVideoData(result[0]);
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!videoData) return;
    setIsExporting(true);

    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoData: {
            ...videoData,
            durationInFrame, // 👈 include from state
          },
        }),
      });

      if (!res.ok) {
        alert("Failed to export video");
        setIsExporting(false);
        return;
      }

      // Stream download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "video.mp4";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={playVideo} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-2xl p-2 shadow-xl w-[380px] max-w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center mb-4">
            🎬 Your video is ready
          </DialogTitle>

          <DialogDescription asChild>
            <div className="flex flex-col items-center">
              {videoData && (
                <Player
                  component={RemotionVideo}
                  durationInFrames={Math.round(durationInFrame)} 
                  compositionWidth={280}
                  compositionHeight={350}
                  fps={30}
                  controls={true}
                  className="rounded-lg shadow-md"
                  inputProps={{
                    ...videoData,
                    setDurationInFrame: (frameValue) => {
                      setDurationInFrame(Math.round(frameValue));
                      console.log(
                        "Duration in frames:",
                        Math.round(frameValue)
                      );
                    },
                  }}
                />
              )}

              <div className="flex gap-4 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    router.replace("/dashboard");
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleExport}
                  disabled={isExporting || !durationInFrame || durationInFrame <= 0}
                >
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default PlayerDialog;
