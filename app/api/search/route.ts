import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase();
  const category = (request.nextUrl.searchParams.get("type") ?? "").trim().toLowerCase();

  const store = await getStore();

  const matches = (value?: string) => {
    if (!value) return false;
    if (!q) return true;
    return value.toLowerCase().includes(q);
  };

  const destinations = store.destinations
    .filter(
      (d) =>
        matches(d.to) || matches(d.country) || matches(d.from) || matches(d.blurb)
    )
    .map((d) => ({
      slug: d.slug,
      to: d.to,
      country: d.country,
      image: d.image,
      price: d.price,
    }));

  const properties = store.properties
    .filter(
      (p) =>
        (matches(p.name) ||
          matches(p.location) ||
          matches(p.city) ||
          matches(p.country)) &&
        (!category || p.category.toLowerCase() === category)
    )
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      location: p.location,
      city: p.city,
      pricePerNight: p.pricePerNight,
      image: p.image,
    }));

  const spots = store.spots
    .filter(
      (s) => matches(s.title) || matches(s.location)
    )
    .map((s) => ({
      key: s.key,
      title: s.title,
      image: s.image,
      price: s.price,
    }));

  return NextResponse.json({ destinations, properties, spots });
}