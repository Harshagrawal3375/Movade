"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 197;
const getFrameSrc = (index: number) =>
  `/hero-scroll/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;

export default function HeroScrollCanvas({
  progressRef,
  className,
}: {
  progressRef: React.MutableRefObject<number>;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    const draw = (img: HTMLImageElement) => {
      const { width, height } = canvas;
      if (!width || !height || !img.naturalWidth) return;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = width / height;
      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawWidth = width;
        drawHeight = width / imgRatio;
        offsetY = (height - drawHeight) / 2;
      } else {
        drawHeight = height;
        drawWidth = height * imgRatio;
        offsetX = (width - drawWidth) / 2;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Cap DPR at 2 to avoid huge canvas on high-DPR devices
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const img = imagesRef.current[currentFrameRef.current];
      if (img?.complete) draw(img);
    };

    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    imagesRef.current = images;

    const loadFrame = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        // Use lower-quality decode hint for performance on mobile
        img.decoding = "async";
        img.src = getFrameSrc(i);
        img.onload = () => resolve();
        img.onerror = () => resolve();
        images[i] = img;
      });

    // Load first 3 frames immediately so hero is never blank
    const bootstrapFrames = [0, 1, 2];
    Promise.all(bootstrapFrames.map(loadFrame)).then(() => {
      if (cancelled) return;
      resize();
    });

    // Load remaining frames in smaller batches to avoid network congestion
    // with the new larger images. Prioritize early frames (user sees them first).
    (async () => {
      // Phase 1: frames 3–30 (first scroll section) – small batches
      const phase1BatchSize = 6;
      for (let i = 3; i < 30 && !cancelled; i += phase1BatchSize) {
        const batch: Promise<void>[] = [];
        for (let j = i; j < Math.min(i + phase1BatchSize, 30); j++) {
          batch.push(loadFrame(j));
        }
        await Promise.all(batch);
      }

      // Phase 2: frames 30–196 – larger batches
      const phase2BatchSize = 12;
      for (let i = 30; i < FRAME_COUNT && !cancelled; i += phase2BatchSize) {
        const batch: Promise<void>[] = [];
        for (let j = i; j < Math.min(i + phase2BatchSize, FRAME_COUNT); j++) {
          batch.push(loadFrame(j));
        }
        await Promise.all(batch);
      }
    })();

    const tick = () => {
      const progress = Math.min(Math.max(progressRef.current, 0), 1);
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(progress * (FRAME_COUNT - 1))
      );

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
      }

      const img = images[frameIndex];
      if (img?.complete && img.naturalWidth) {
        draw(img);
      } else {
        // Fall back to nearest loaded frame
        for (let offset = 1; offset < 20; offset++) {
          const prev = images[frameIndex - offset];
          if (prev?.complete && prev.naturalWidth) {
            draw(prev);
            break;
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("resize", resize);
    resize();

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} className={className} />;
}
