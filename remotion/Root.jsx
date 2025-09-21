"use client";
import RemotionVideo from "../app/dashboard/_components/RemotionVideo";
import { Composition } from "remotion";

export const RemotionRoot = ({ inputProps }) => (
  <Composition
    id="MyVideo"
    component={RemotionVideo}
    durationInFrames={inputProps?.durationInFrame ?? 900} // Use prop or fallback
    fps={30}
    width={1080}
    height={1920}
    defaultProps={inputProps}
  />
);
