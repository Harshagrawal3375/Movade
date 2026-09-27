"use client";

import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DottedMap from "dotted-map";
import Image from "next/image";

type LabelDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
type LabelOffset = { x?: number; y?: number };

interface MapProps {
  dots?: Array<{
    start: {
      lat: number;
      lng: number;
      label?: string;
      labelDir?: LabelDir;
      labelOffset?: LabelOffset;
    };
    end: {
      lat: number;
      lng: number;
      label?: string;
      labelDir?: LabelDir;
      labelOffset?: LabelOffset;
    };
    curveOffset?: number;
  }>;
  lineColor?: string;
  showLabels?: boolean;
  labelClassName?: string;
  animationDuration?: number;
  loop?: boolean;
  dark?: boolean;
}

function MapLabel({
  x,
  y,
  text,
  lineColor,
  labelClassName,
  appearDelay = 0.3,
  dir = "n",
  offset,
}: {
  x: number;
  y: number;
  text: string;
  lineColor: string;
  labelClassName: string;
  appearDelay?: number;
  dir?: LabelDir;
  offset?: LabelOffset;
}) {
  const boxW = Math.max(90, Math.min(150, text.length * 9 + 34));
  const boxH = 24;
  const gap = 16;
  const anchorX = x + (offset?.x ?? 0);
  const anchorY = y + (offset?.y ?? 0);

  let boxX = anchorX - boxW / 2;
  let boxY = anchorY - gap - boxH;
  let arrowPoints = `${anchorX - 4},${anchorY - gap} ${anchorX + 4},${
    anchorY - gap
  } ${anchorX},${anchorY - gap + 6}`;
  let origin = `${anchorX}px ${anchorY - gap}px`;

  if (dir === "s") {
    boxY = anchorY + gap;
    arrowPoints = `${anchorX - 4},${anchorY + gap} ${anchorX + 4},${
      anchorY + gap
    } ${anchorX},${anchorY + gap - 6}`;
    origin = `${anchorX}px ${anchorY + gap}px`;
  } else if (dir === "e") {
    boxX = anchorX + gap;
    boxY = anchorY - boxH / 2;
    arrowPoints = `${anchorX + gap},${anchorY - 4} ${anchorX + gap},${
      anchorY + 4
    } ${anchorX + gap - 6},${anchorY}`;
    origin = `${anchorX + gap}px ${anchorY}px`;
  } else if (dir === "w") {
    boxX = anchorX - gap - boxW;
    boxY = anchorY - boxH / 2;
    arrowPoints = `${anchorX - gap},${anchorY - 4} ${anchorX - gap},${
      anchorY + 4
    } ${anchorX - gap + 6},${anchorY}`;
    origin = `${anchorX - gap}px ${anchorY}px`;
  } else if (dir === "ne") {
    boxX = anchorX + gap;
    boxY = anchorY - gap - boxH;
    arrowPoints = `${anchorX + gap},${anchorY - gap} ${anchorX + gap + 8},${
      anchorY - gap
    } ${anchorX + gap},${anchorY - gap + 8}`;
    origin = `${anchorX + gap}px ${anchorY - gap}px`;
  } else if (dir === "nw") {
    boxX = anchorX - gap - boxW;
    boxY = anchorY - gap - boxH;
    arrowPoints = `${anchorX - gap},${anchorY - gap} ${anchorX - gap - 8},${
      anchorY - gap
    } ${anchorX - gap},${anchorY - gap + 8}`;
    origin = `${anchorX - gap}px ${anchorY - gap}px`;
  } else if (dir === "se") {
    boxX = anchorX + gap;
    boxY = anchorY + gap;
    arrowPoints = `${anchorX + gap},${anchorY + gap} ${anchorX + gap + 8},${
      anchorY + gap
    } ${anchorX + gap},${anchorY + gap - 8}`;
    origin = `${anchorX + gap}px ${anchorY + gap}px`;
  } else if (dir === "sw") {
    boxX = anchorX - gap - boxW;
    boxY = anchorY + gap;
    arrowPoints = `${anchorX - gap},${anchorY + gap} ${anchorX - gap - 8},${
      anchorY + gap
    } ${anchorX - gap},${anchorY + gap - 8}`;
    origin = `${anchorX - gap}px ${anchorY + gap}px`;
  }

  return (
    <motion.g
      className="pointer-events-none"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: appearDelay, ease: "easeOut" }}
      style={{ transformOrigin: origin }}
    >
      <polygon points={arrowPoints} fill={lineColor} />
      <foreignObject x={boxX} y={boxY} width={boxW} height={boxH} className="block">
        <div className="flex h-full items-center justify-center">
          <span
            className={`${labelClassName} whitespace-nowrap rounded-full border border-white/10 bg-black/85 px-2.5 py-1 font-medium text-white shadow-lg`}
          >
            {text}
          </span>
        </div>
      </foreignObject>
    </motion.g>
  );
}

export function WorldMap({
  dots = [],
  lineColor = "#B6FF3C",
  showLabels = true,
  labelClassName = "text-sm",
  animationDuration = 2,
  loop = true,
  dark = true,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);

  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.22,
        color: dark ? "#FFFFFF33" : "#00000040",
        shape: "circle",
        backgroundColor: dark ? "#0B0F0D" : "white",
      }),
    [map, dark]
  );

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number },
    curveOffset = 0
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    const lift = Math.min(60, Math.max(28, length * 0.35));
    const controlX = midX + (-dy / length) * curveOffset;
    const controlY = midY + (dx / length) * curveOffset - lift;

    return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
  };

  const staggerDelay = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime = 2;
  const fullCycleDuration = totalAnimationTime + pauseTime;

  return (
    <div
      className={`relative aspect-[2/1] w-full overflow-hidden rounded-3xl font-sans md:aspect-[2.5/1] lg:aspect-[2/1] ${
        dark ? "bg-bg-dark" : "bg-white"
      }`}
      onMouseLeave={() => setHoveredLocation(null)}
    >
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="pointer-events-none h-full w-full object-cover [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
        priority
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="pointer-events-auto absolute inset-0 h-full w-full select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <filter id="glow">
            <feMorphology operator="dilate" radius="0.5" />
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          const path = createCurvedPath(startPoint, endPoint, dot.curveOffset);

          const startTime = (i * staggerDelay) / fullCycleDuration;
          const endTime = (i * staggerDelay + animationDuration) / fullCycleDuration;
          const resetTime = totalAnimationTime / fullCycleDuration;

          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={path}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={
                  loop ? { pathLength: [0, 0, 1, 1, 0] } : { pathLength: 1 }
                }
                transition={
                  loop
                    ? {
                        duration: fullCycleDuration,
                        times: [0, startTime, endTime, resetTime, 1],
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0,
                      }
                    : {
                        duration: animationDuration,
                        delay: i * staggerDelay,
                        ease: "easeInOut",
                      }
                }
              />

              {loop && (
                <motion.polygon
                  points="-5,-4 6,0 -5,4"
                  fill={lineColor}
                  filter="url(#glow)"
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{
                    offsetDistance: [
                      null as unknown as string,
                      "0%",
                      "100%",
                      "100%",
                      "100%",
                    ],
                    opacity: [0, 0, 1, 0, 0],
                  }}
                  transition={{
                    duration: fullCycleDuration,
                    times: [0, startTime, endTime, resetTime, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                  style={{
                    offsetPath: `path('${path}')`,
                    offsetRotate: "auto",
                  }}
                />
              )}
            </g>
          );
        })}

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          const startKey = `${dot.start.lat}-${dot.start.lng}-${dot.start.label ?? ""}`;
          const showStart = dots.findIndex((item) => {
            const itemKey = `${item.start.lat}-${item.start.lng}-${item.start.label ?? ""}`;
            return itemKey === startKey;
          }) === i;

          return (
            <g key={`points-group-${i}`}>
              {showStart && (
                <g key={`start-${i}`}>
                  <motion.g
                    onHoverStart={() =>
                      setHoveredLocation(dot.start.label || `Location ${i}`)
                    }
                    onHoverEnd={() => setHoveredLocation(null)}
                    className="cursor-pointer"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <circle
                      cx={startPoint.x}
                      cy={startPoint.y}
                      r="3"
                      fill={lineColor}
                      filter="url(#glow)"
                      className="drop-shadow-lg"
                    />
                    <circle cx={startPoint.x} cy={startPoint.y} r="3" fill={lineColor} opacity="0.5">
                      <animate
                        attributeName="r"
                        from="3"
                        to="12"
                        dur="2s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="2s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </motion.g>

                  {showLabels && dot.start.label && i === 0 && (
                    <MapLabel
                      x={startPoint.x}
                      y={startPoint.y}
                      text={dot.start.label}
                      lineColor={lineColor}
                      labelClassName={labelClassName}
                      dir={dot.start.labelDir ?? "n"}
                      offset={dot.start.labelOffset}
                    />
                  )}
                </g>
              )}

              <g key={`end-${i}`}>
                <motion.g
                  onHoverStart={() =>
                    setHoveredLocation(dot.end.label || `Destination ${i}`)
                  }
                  onHoverEnd={() => setHoveredLocation(null)}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <circle
                    cx={endPoint.x}
                    cy={endPoint.y}
                    r="3"
                    fill={lineColor}
                    filter="url(#glow)"
                    className="drop-shadow-lg"
                  />
                  <circle cx={endPoint.x} cy={endPoint.y} r="3" fill={lineColor} opacity="0.5">
                    <animate
                      attributeName="r"
                      from="3"
                      to="12"
                      dur="2s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="2s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </motion.g>

                {showLabels && dot.end.label && (
                  <MapLabel
                    x={endPoint.x}
                    y={endPoint.y}
                    text={dot.end.label}
                    lineColor={lineColor}
                    labelClassName={labelClassName}
                    appearDelay={0.2 + i * 0.1}
                    dir={dot.end.labelDir ?? "n"}
                    offset={dot.end.labelOffset}
                  />
                )}
              </g>
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-none absolute bottom-4 left-4 rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm"
          >
            {hoveredLocation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
