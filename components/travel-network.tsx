"use client";

import { WorldMap } from "@/components/ui/map";
import Reveal from "@/components/ui/reveal";

const DELHI = {
  lat: 28.6139,
  lng: 77.209,
  label: "Delhi",
  labelDir: "nw" as const,
};

export default function TravelNetwork() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-medium text-accent-green">
          Global Network
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl lg:text-5xl">
          Every Trip, Connected
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-muted md:text-base">
          From Delhi to India&apos;s most sought-after coastlines and skylines -
          Movade plans the route, you enjoy the journey.
        </p>
      </Reveal>

      <WorldMap
        lineColor="#B6FF3C"
        labelClassName="text-xs md:text-sm"
        dots={[
          {
            start: DELHI,
            end: { lat: 15.2993, lng: 74.124, label: "Goa", labelDir: "sw" },
            curveOffset: -26,
          },
          {
            start: DELHI,
            end: { lat: 26.9124, lng: 75.7873, label: "Jaipur", labelDir: "n" },
            curveOffset: 32,
          },
          {
            start: DELHI,
            end: {
              lat: 19.076,
              lng: 72.8777,
              label: "Mumbai",
              labelDir: "w",
              labelOffset: { y: -4 },
            },
            curveOffset: -10,
          },
          {
            start: DELHI,
            end: {
              lat: 11.9416,
              lng: 79.8083,
              label: "Pondicherry",
              labelDir: "e",
              labelOffset: { y: -12 },
            },
            curveOffset: 20,
          },
          {
            start: DELHI,
            end: {
              lat: 11.7401,
              lng: 92.6586,
              label: "Andaman",
              labelDir: "se",
              labelOffset: { y: 6 },
            },
            curveOffset: 46,
          },
          {
            start: DELHI,
            end: {
              lat: 10.5886,
              lng: 72.1911,
              label: "Lakshadweep",
              labelDir: "sw",
              labelOffset: { y: 14 },
            },
            curveOffset: -42,
          },
        ]}
      />
    </section>
  );
}
