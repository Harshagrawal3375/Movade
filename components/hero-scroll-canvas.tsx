"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 197;
const EAGER_FRAMES = 30; // first scroll section loads up front (~2.6MB of ~17MB)
const PREFETCH_RADIUS = 10;
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
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const loadingRef = useRef<Set<number>>(new Set());
  const currentFrameRef = useRef(0);
  const visibleRef = useRef(true);
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
      // Cap DPR at 1.5: halves canvas memory vs DPR 2 with negligible visual loss
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const img = imagesRef.current[currentFrameRef.current];
      if (img?.complete) draw(img);
    };

    const images: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
    imagesRef.current = images;

    const loadFrame = (i: number): Promise<void> => {
      if (images[i]?.complete || loadingRef.current.has(i)) {
        return Promise.resolve();
      }
      loadingRef.current.add(i);
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        const done = () => {
          loadingRef.current.delete(i);
          resolve();
        };
        img.onload = done;
        img.onerror = done;
        img.src = getFrameSrc(i);
        images[i] = img;
      });
    };

    // Eager: frame 0 first so hero is never blank, then the first scroll section
    loadFrame(0).then(() => {
      if (cancelled) return;
      resize();
    });
    (async () => {
      const batchSize = 6;
      for (let i = 1; i < EAGER_FRAMES && !cancelled; i += batchSize) {
        const batch: Promise<void>[] = [];
        for (let j = i; j < Math.min(i + batchSize, EAGER_FRAMES); j++) {
          batch.push(loadFrame(j));
        }
        await Promise.all(batch);
      }
    })();

    // On-demand: fetch frames around the current scroll position only.
    const ensureNearby = (frameIndex: number) => {
      for (
        let i = Math.max(0, frameIndex - 2);
        i <= Math.min(FRAME_COUNT - 1, frameIndex + PREFETCH_RADIUS);
        i++
      ) {
        void loadFrame(i);
      }
    };

    const tick = () => {
      if (!cancelled && visibleRef.current && !document.hidden) {
        const progress = Math.min(Math.max(progressRef.current, 0), 1);
        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(progress * (FRAME_COUNT - 1))
        );

        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          ensureNearby(frameIndex);
        }

        const img = images[frameIndex];
        if (img?.complete && img.naturalWidth) {
          draw(img);
        } else {
          // Fall back to nearest loaded frame; trigger its load
          void loadFrame(frameIndex);
          for (let offset = 1; offset < 20; offset++) {
            const prev = images[frameIndex - offset];
            if (prev?.complete && prev.naturalWidth) {
              draw(prev);
              break;
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // Pause rendering + prefetching while the hero is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden) {
        const img = imagesRef.current[currentFrameRef.current];
        if (img?.complete) draw(img);
      }
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    resize();

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} className={className} />;
}
