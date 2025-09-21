"use client";
import React, { useEffect } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

function RemotionVideo({
  script,
  audioFileUrl,
  captions,
  imageList,
  setDurationInFrame,
}) {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // ✅ compute duration safely
  const duration =
    captions && captions.length > 0
      ? Math.min((captions[captions.length - 1].end / 1000) * fps, 900) // max 30s
      : fps * 20; // fallback 20s

  // ✅ update parent state only AFTER render
  useEffect(() => {
    if (setDurationInFrame && duration) {
      setDurationInFrame(duration);
    }
  }, [duration, setDurationInFrame]);

  const GetCurrentCaptions = () => {
    if (!captions || captions.length === 0) return "";
    const currentTime = (frame / fps) * 1000;
    const currentCaption = captions.find(
      (caption) => currentTime >= caption.start && currentTime <= caption.end
    );
    return currentCaption ? currentCaption.text : "";
  };

  return (
    <AbsoluteFill className="bg-black flex flex-col items-center justify-center">
      {imageList?.length > 0 ? (
        imageList.map((item, index) => {
          const startTime = (index * duration) / imageList.length;

          // ✅ base zoom in/out logic
          const targetScale = interpolate(
            frame,
            [startTime, startTime + duration / 2, startTime + duration],
            index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // ✅ smooth intro (first 15 frames show "full image")
          const smoothScale = interpolate(
            frame,
            [startTime, startTime + 15], // first 15 frames (~0.5s)
            [0.95, targetScale], // start slightly smaller (contain feel) → zoom logic
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <Sequence key={index} from={startTime} durationInFrames={duration}>
              <AbsoluteFill
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  transform: `scale(${smoothScale})`,
                }}
              >
                <Img
                  src={item}
                  width="100%"
                  height="100%"
                  style={{ objectFit: "cover" }}
                />
                <AbsoluteFill
                  style={{
                    color: "white",
                    justifyContent: "center",
                    top: undefined,
                    bottom: 50,
                    height: 150,
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  <h2 className="text-2xl">{GetCurrentCaptions()}</h2>
                </AbsoluteFill>
              </AbsoluteFill>
            </Sequence>
          );
        })
      ) : (
        <div className="text-white">No images available</div>
      )}

      {audioFileUrl && <Audio src={audioFileUrl} />}
    </AbsoluteFill>
  );
}

export default RemotionVideo;
