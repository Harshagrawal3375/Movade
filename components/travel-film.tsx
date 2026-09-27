"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "@/components/ui/modal";

const FRAME_COUNT = 197;
const FPS = 24;
const DURATION = FRAME_COUNT / FPS;

const getFrameSrc = (index: number) =>
  `/hero-scroll/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;

export default function TravelFilm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0.12);
  const [playing, setPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);
  const progressRef = useRef(0.12);

  const draw = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
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
  }, []);

  const showFrame = useCallback(
    (frameIndex: number) => {
      const img = imagesRef.current[frameIndex];
      if (img?.complete && img.naturalWidth) {
        draw(img);
        return true;
      }
      // fall back to nearest loaded frame
      for (let offset = 1; offset < FRAME_COUNT; offset++) {
        const f = frameIndex - offset;
        if (f < 0) break;
        const prev = imagesRef.current[f];
        if (prev?.complete && prev.naturalWidth) {
          draw(prev);
          return true;
        }
      }
      return false;
    },
    [draw]
  );

  // Preload frames when modal opens
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    const imgs: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    imagesRef.current = imgs;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = getFrameSrc(i);
        img.onload = () => {
          imgs[i] = img;
          resolve();
        };
        img.onerror = () => resolve();
      });

    (async () => {
      const batchSize = 8;
      for (let i = 0; i < FRAME_COUNT && !cancelled; i += batchSize) {
        const batch: Promise<void>[] = [];
        for (let j = i; j < Math.min(i + batchSize, FRAME_COUNT); j++) {
          batch.push(load(j));
        }
        await Promise.all(batch);
      }
      if (!cancelled) {
        setLoading(false);
        setReady(true);
        showFrame(Math.floor(progressRef.current * FRAME_COUNT));
      }
    })();

    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      showFrame(Math.floor(progressRef.current * FRAME_COUNT));
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [open, showFrame]);

  // Playback loop
  useEffect(() => {
    if (!open || !ready) return;
    lastTickRef.current = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      if (playing) {
        let p = progressRef.current + dt / DURATION;
        if (p >= 1) p = 1;
        progressRef.current = p;
        setProgress(p);
        showFrame(Math.floor(p * (FRAME_COUNT - 1)));
        if (p >= 1) {
          setPlaying(false);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    if (playing) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [open, ready, playing, showFrame]);

  const seek = (value: number) => {
    progressRef.current = value;
    setProgress(value);
    showFrame(Math.floor(value * (FRAME_COUNT - 1)));
  };

  const replay = () => {
    seek(0);
    setPlaying(true);
  };

  const fmt = (p: number) => {
    const secs = Math.floor(p * DURATION);
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  };

  return (
    <Modal open={open} onClose={onClose} title="Travel Film">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
        <canvas ref={canvasRef} className="h-full w-full" />
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent-green border-t-transparent" />
            <p className="text-sm text-white/70">Loading the film…</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => (playing ? setPlaying(false) : setPlaying(true))}
          disabled={!ready}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-text-primary text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="3" y="2.5" width="3.5" height="11" rx="1" fill="currentColor" />
              <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4.5 2.5L13 8L4.5 13.5V2.5Z" fill="currentColor" />
            </svg>
          )}
        </button>

        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(progress * 100)}
          disabled={!ready}
          onChange={(e) => seek(Number(e.target.value) / 100)}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-text-primary/20 accent-accent-green"
          aria-label="Seek"
        />

        <span className="w-16 shrink-0 text-right text-xs font-medium text-text-muted tabular-nums">
          {fmt(progress)} / {fmt(1)}
        </span>

        <button
          onClick={replay}
          disabled={!ready}
          aria-label="Replay"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-subtle text-text-primary transition-colors hover:bg-text-primary hover:text-white disabled:opacity-40"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9M2.5 1.5v3h3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-text-muted">
        A short film of real journeys with Movade — glimpses from the trail,
        the coast, and the moment the day turns golden.
      </p>
    </Modal>
  );
}