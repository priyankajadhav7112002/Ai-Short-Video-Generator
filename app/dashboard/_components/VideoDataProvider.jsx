"use client";
import { VideoDataContext } from "@/app/(auth)/_context/VideoDataContext";
import { useState } from "react";
// import { VideoDataContext } from "../../(auth)/_context/VideoDataContext";

export default function VideoDataProvider({ children }) {
  const [videoData, setVideoData] = useState([]);

  return (
    <VideoDataContext.Provider value={{ videoData, setVideoData }}>
      {children}
    </VideoDataContext.Provider>
  );
}
