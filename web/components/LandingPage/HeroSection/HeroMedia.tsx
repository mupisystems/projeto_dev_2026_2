"use client";

import { useEffect, useRef, useState } from "react";

const PLAYBACK_END = 12.2;

export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFinished, setVideoFinished] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let frozen = false;

    const freeze = () => {
      if (frozen) return;
      frozen = true;
      video.pause();
      video.currentTime = PLAYBACK_END;
      setVideoFinished(true);
    };
    const handleTimeUpdate = () => {
      if (video.currentTime >= PLAYBACK_END) freeze();
    };
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) freeze();
    else {
      video.currentTime = 0;
      void video.play().catch(() => setVideoFinished(true));
    }

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", freeze);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", freeze);
    };
  }, []);

  return (
    <div className="hero-media" aria-hidden="true">
      <img className="hero-media-layer hero-static-frame" src="/videos/hero-final-frame.jpg" alt="" />
      <video ref={videoRef} className={`hero-media-layer hero-video ${videoFinished ? "hero-video-finished" : ""}`} autoPlay muted playsInline preload="auto" onError={() => setVideoFinished(true)}>
        <source src="/videos/hero-video-web.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
