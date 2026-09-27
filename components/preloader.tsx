"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setVisible(false);
      return;
    }

    const failSafe = setTimeout(() => setVisible(false), 5000);

    const video = videoRef.current;
    const onEnded = () => setVisible(false);
    video?.addEventListener("ended", onEnded);

    return () => {
      clearTimeout(failSafe);
      video?.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-dark"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-auto w-[min(60vw,420px)] object-contain mix-blend-screen"
            >
              <source src="/preloader.webm" type="video/webm" />
              <source src="/preloader.mp4" type="video/mp4" />
            </video>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
