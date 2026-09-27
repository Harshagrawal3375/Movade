import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

export async function GET() {
  const store = await getStore();
  return NextResponse.json({
    destinations: store.destinations,
    properties: store.properties,
    spots: store.spots,
    blogs: store.blogs,
    testimonials: store.testimonials,
  });
}