import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  BlogPost,
  Booking,
  Consultation,
  Destination,
  Property,
  Spot,
  Subscriber,
  Testimonial,
  User,
} from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "app-data.json");

export interface AppData {
  destinations: Destination[];
  properties: Property[];
  spots: Spot[];
  blogs: BlogPost[];
  testimonials: Testimonial[];
  bookings: Booking[];
  consultations: Consultation[];
  subscribers: Subscriber[];
  users: User[];
}

const seedData: AppData = {
  destinations: [
    {
      slug: "goa",
      from: "Delhi",
      to: "Goa",
      country: "India",
      date: "Fri, May 21 - Mon, Jun 10",
      price: "₹16,500",
      image: "/travel-images/918a169bbf090069562831cff42108b1.jpg",
      rating: "4.9",
      reviews: "3.1k",
      blurb:
        "Beach shacks, Portuguese-era churches and street-side fish frying on the pan. Our most-booked escape from Delhi.",
      duration: "3-7 Days",
    },
    {
      slug: "jaipur",
      from: "Delhi",
      to: "Jaipur",
      country: "India",
      date: "Fri, May 21 - Mon, Jun 10",
      price: "₹9,999",
      image: "/travel-images/b55e27b99cc7b9ac2a9880e6087c8dc7.jpg",
      rating: "4.8",
      reviews: "2.6k",
      blurb:
        "Sunset light on the Hawa Mahal, quiet mornings in the City Palace, and bazaars that load your bags with color.",
      duration: "3-5 Days",
    },
    {
      slug: "mumbai",
      from: "Delhi",
      to: "Mumbai",
      country: "India",
      date: "Fri, May 21 - Mon, Jun 10",
      price: "₹11,499",
      image: "/travel-images/b917fdc63744ad30426969f6d5402ce8.jpg",
      rating: "4.7",
      reviews: "1.9k",
      blurb:
        "Marine Drive at sunset, street food on Mohammed Ali Road, and the city that never dims its skyline.",
      duration: "4-6 Days",
    },
    {
      slug: "pondicherry",
      from: "Delhi",
      to: "Pondicherry",
      country: "India",
      date: "Fri, May 21 - Mon, Jun 10",
      price: "₹8,750",
      image: "/travel-images/bbd7a6fd1334471c8a774dcd5c4cf27b.jpg",
      rating: "4.6",
      reviews: "3.8k",
      blurb:
        "Pastel-rinsed French lanes, a quiet seafront promenade and southern seafood served with mustard seeds.",
      duration: "2-4 Days",
    },
    {
      slug: "andaman",
      from: "Delhi",
      to: "Andaman & Nicobar",
      country: "India",
      date: "Sat, Jun 12 - Sat, Jun 19",
      price: "₹26,999",
      image: "/travel-images/0a96943f1916d715e834aab34919e7be.jpg",
      rating: "4.9",
      reviews: "2.2k",
      blurb:
        "White-sand coves, water that reads like a postcard and sunsets over Radhanagar Beach you won't forget.",
      duration: "5-7 Days",
    },
    {
      slug: "meghalaya",
      from: "Delhi",
      to: "Meghalaya",
      country: "India",
      date: "Sat, Jun 12 - Sat, Jun 19",
      price: "₹15,499",
      image: "/travel-images/e7f9c5996ffd239cb580afcbaf7b39be.jpg",
      rating: "4.8",
      reviews: "4.4k",
      blurb:
        "Living root bridges, waterfalls you swim under alone, and the greenest valleys in India.",
      duration: "5-8 Days",
    },
    {
      slug: "udaipur",
      from: "Delhi",
      to: "Udaipur",
      country: "India",
      date: "Sat, Jun 12 - Sat, Jun 19",
      price: "₹14,999",
      image: "/travel-images/f94c5898fcc5227a6b969b303bf8a1b6.jpg",
      rating: "4.7",
      reviews: "2.9k",
      blurb:
        "Lake-palace views, marble ghats and the quiet luxury of Rajasthan's most romantic city.",
      duration: "3-5 Days",
    },
    {
      slug: "lakshadweep",
      from: "Delhi",
      to: "Lakshadweep",
      country: "India",
      date: "Sat, Jun 12 - Sat, Jun 19",
      price: "₹32,999",
      image: "/travel-images/ed65027a80e9751a36aa504460ba7694.jpg",
      rating: "4.9",
      reviews: "1.7k",
      blurb:
        "Coral-ringed lagoons, house-reef snorkeling and water so clear it looks like it was drawn.",
      duration: "4-6 Days",
    },
  ],
  properties: [
    {
      id: "p-001",
      slug: "palolem-beach-villa",
      name: "Palolem Beach Villa",
      category: "Villa",
      location: "Palolem",
      city: "Goa",
      country: "India",
      pricePerNight: 89,
      rating: 4.9,
      reviews: 214,
      image: "/travel-images/918a169bbf090069562831cff42108b1.jpg",
      amenities: ["Private Beach", "Pool", "Free WiFi", "Breakfast"],
      badge: "Best Seller",
      description:
        "A tranquil palm-shaded villa steps from Palolem's crescent beach, with a private pool and daily breakfast.",
    },
    {
      id: "p-002",
      slug: "hawa-mahal-view-heritage-hotel",
      name: "Hawa Mahal View Heritage Hotel",
      category: "Hotel",
      location: "Bani Park",
      city: "Jaipur",
      country: "India",
      pricePerNight: 142,
      rating: 4.8,
      reviews: 1865,
      image: "/travel-images/b55e27b99cc7b9ac2a9880e6087c8dc7.jpg",
      amenities: ["Free WiFi", "Spa", "Restaurant", "Airport Shuttle"],
      description:
        "Rooftop views over the pink city's iconic facade, minutes from the bazaars and the City Palace.",
    },
    {
      id: "p-003",
      slug: "marine-drive-apartment",
      name: "Marine Drive Apartment",
      category: "Apartment",
      location: "Marine Drive",
      city: "Mumbai",
      country: "India",
      pricePerNight: 118,
      rating: 4.7,
      reviews: 932,
      image: "/travel-images/b917fdc63744ad30426969f6d5402ce8.jpg",
      amenities: ["Gym", "Free WiFi", "Kitchen", "City Views"],
      description:
        "A modern furnished apartment facing the Queen's Necklace, with skyline views over the Arabian Sea.",
    },
    {
      id: "p-004",
      slug: "promenade-beach-resort",
      name: "Promenade Beach Resort",
      category: "Hotel",
      location: "Promenade",
      city: "Pondicherry",
      country: "India",
      pricePerNight: 75,
      rating: 4.6,
      reviews: 1211,
      image: "/travel-images/bbd7a6fd1334471c8a774dcd5c4cf27b.jpg",
      amenities: ["Beachfront", "Pool", "Restaurant", "Free WiFi"],
      description:
        "Ocean-facing rooms on the French promenade with golden sunsets outside your window.",
    },
    {
      id: "p-005",
      slug: "radhanagar-lagoon-suite",
      name: "Radhanagar Lagoon Suite",
      category: "Villa",
      location: "Radhanagar Beach",
      city: "Andaman & Nicobar Islands",
      country: "India",
      pricePerNight: 310,
      rating: 4.9,
      reviews: 447,
      image: "/travel-images/0a96943f1916d715e834aab34919e7be.jpg",
      amenities: ["Infinity Pool", "Sunset View", "Breakfast", "Concierge"],
      badge: "Featured",
      description:
        "A private suite among the palms at Asia's most famous beach, with an infinity pool facing the sunset.",
    },
    {
      id: "p-006",
      slug: "living-root-bridge-eco-stay",
      name: "Living Root Bridge Eco Stay",
      category: "House",
      location: "Mawlynnong",
      city: "Meghalaya",
      country: "India",
      pricePerNight: 96,
      rating: 4.8,
      reviews: 763,
      image: "/travel-images/e7f9c5996ffd239cb580afcbaf7b39be.jpg",
      amenities: ["Rice Terrace View", "Garden", "Kitchen", "Free WiFi"],
      description:
        "A serene private house wrapped in jungle and waterfalls — morning mist, evening fireflies.",
    },
    {
      id: "p-007",
      slug: "lake-palace-blue-suite",
      name: "Lake Palace Blue Suite",
      category: "Apartment",
      location: "Pichola Lake",
      city: "Udaipur",
      country: "India",
      pricePerNight: 158,
      rating: 4.7,
      reviews: 1204,
      image: "/travel-images/f94c5898fcc5227a6b969b303bf8a1b6.jpg",
      amenities: ["Lake Views", "Gym", "Pool", "Parking"],
      description:
        "Windows over Pichola's mirror-still water, minutes from the City Palace and the lakefront ghats.",
    },
    {
      id: "p-008",
      slug: "bangaram-overwater-retreat",
      name: "Bangaram Overwater Retreat",
      category: "Hotel",
      location: "Bangaram Atoll",
      city: "Lakshadweep",
      country: "India",
      pricePerNight: 420,
      rating: 4.9,
      reviews: 512,
      image: "/travel-images/ed65027a80e9751a36aa504460ba7694.jpg",
      amenities: ["Overwater Bungalow", "House Reef", "Spa", "All Inclusive"],
      badge: "Honeymoon Pick",
      description:
        "A classic overwater bungalow with direct snorkel access into a vibrant coral house reef.",
    },
    {
      id: "p-009",
      slug: "solang-alpine-cabin",
      name: "Solang Alpine Cabin",
      category: "Residential",
      location: "Solang Valley",
      city: "Manali",
      country: "India",
      pricePerNight: 64,
      rating: 4.6,
      reviews: 388,
      image: "/travel-images/fa6dec2785180e3f6486b6bf762d5292.jpg",
      amenities: ["Mountain View", "Fireplace", "Hiking Access", "Kitchen"],
      description:
        "A cozy high-country cabin built for trekkers — slow mornings, fast trails, star-filled nights.",
    },
    {
      id: "p-010",
      slug: "city-palace-heritage-stay",
      name: "City Palace Heritage Stay",
      category: "Residential",
      location: "Old Quarter",
      city: "Jaipur",
      country: "India",
      pricePerNight: 72,
      rating: 4.7,
      reviews: 655,
      image: "/travel-images/fc1d3bb67539b24e1f0a73cf4f603488.jpg",
      amenities: ["Heritage Architecture", "Breakfast", "Courtyard", "Free WiFi"],
      description:
        "A restored haveli with painted arches and rooftop breakfasts above the old city.",
    },
    {
      id: "p-011",
      slug: "gokarna-cliffside-cottage",
      name: "Gokarna Cliffside Cottage",
      category: "Apartment",
      location: "Om Beach",
      city: "Gokarna",
      country: "India",
      pricePerNight: 205,
      rating: 4.8,
      reviews: 871,
      image: "/travel-images/0fa4c41f84e6f6e70057623bc670741c.jpg",
      amenities: ["Sea View", "Terrace", "Kitchen", "Near Beach"],
      badge: "Romantic",
      description:
        "Coconut-shaded terraces and a cliffside balcony looking straight down the Arabian Sea.",
    },
    {
      id: "p-012",
      slug: "fort-kochi-heritage-hotel",
      name: "Fort Kochi Heritage Hotel",
      category: "Hotel",
      location: "Fort Kochi",
      city: "Kochi",
      country: "India",
      pricePerNight: 128,
      rating: 4.8,
      reviews: 1024,
      image: "/travel-images/1babc905994f380026708c0f1c038d8c.jpg",
      amenities: ["Old Town Location", "Rooftop Bar", "Breakfast", "Free WiFi"],
      description:
        "Inside the heritage quarter — step out your door onto mango-tiled lanes of old Kochi.",
    },
  ],
  spots: [
    {
      key: "andaman",
      image: "/travel-images/0a96943f1916d715e834aab34919e7be.jpg",
      tag: "Featured",
      title: "Radhanagar Sunset Tour",
      rating: "4.9",
      reviews: "3.5k",
      location: "Havelock, Andaman Islands",
      duration: "3 Days",
      price: "₹14,500",
      showPrice: true,
      emoji: "🌄",
      blurb:
        "A small-group trip through island coves ending at Radhanagar Beach for the golden hour.",
    },
    {
      key: "konkan",
      image: "/travel-images/0fa4c41f84e6f6e70057623bc670741c.jpg",
      tag: "Adventure",
      title: "Konkan Coastal Drive",
      rating: "4.8",
      reviews: "2.5k",
      location: "Konkan Coast, Maharashtra",
      duration: null,
      price: null,
      showPrice: false,
      emoji: "🚗",
      blurb:
        "Hairpin turns, cliffside villages and kokum-juice stops along India's most scenic coastal road.",
    },
    {
      key: "jaipur",
      image: "/travel-images/1babc905994f380026708c0f1c038d8c.jpg",
      tag: "Heritage",
      title: "Pink City Heritage Walk",
      rating: "4.7",
      reviews: "1.5k",
      location: "Jaipur, Rajasthan",
      duration: null,
      price: null,
      showPrice: false,
      emoji: "🏛️",
      blurb:
        "Walk the old city walls at sunrise, then lose yourself in the bazaars of Rajasthan's pink capital.",
    },
    {
      key: "mumbai",
      image: "/travel-images/22f55cc3f9c4f438dcaff5873166bc37.jpg",
      tag: "City",
      title: "Mumbai Skyline Night Tour",
      rating: "4.8",
      reviews: "1.9k",
      location: "Mumbai, Maharashtra",
      duration: "1 Day",
      price: "₹3,200",
      showPrice: true,
      emoji: "🌃",
      blurb:
        "Marine Drive at its brightest, neon alleys and a rooftop viewpoint over the city that never dims.",
    },
    {
      key: "meghalaya",
      image: "/travel-images/644728dd03e03051ec91872eee56abce.jpg",
      tag: "Nature",
      title: "Meghalaya Root Bridge Trek",
      rating: "4.9",
      reviews: "2.8k",
      location: "Cherrapunji, Meghalaya",
      duration: "2 Days",
      price: "₹6,500",
      showPrice: true,
      emoji: "🌉",
      blurb:
        "Sunrise trek through living root bridges, a waterfall breakfast stop, and a cold spring swim.",
    },
    {
      key: "lakshadweep",
      image: "/travel-images/911f4d44cff2a44ffe3c206589fa738f.jpg",
      tag: "Water",
      title: "Lakshadweep Dolphin Safari",
      rating: "4.9",
      reviews: "1.2k",
      location: "Bangaram, Lakshadweep",
      duration: "1 Day",
      price: "₹7,800",
      showPrice: true,
      emoji: "🐬",
      blurb:
        "Sunset cruise chasing spinner dolphins, then a sandbank barbecue under a sky full of stars.",
    },
  ],
  blogs: [
    {
      slug: "hidden-gems-of-india",
      image: "/travel-images/0a96943f1916d715e834aab34919e7be.jpg",
      title: "Hidden Gems of India",
      date: "Dec 5, 2025",
      category: "India",
      excerpt:
        "Beyond the famous monuments lie quieter valleys, secret waterfalls and towns that rarely make the tourist lists.",
      body: [
        "Everyone photographs the big names — the Taj Mahal at dawn, Jaipur's pink lanes, Varanasi's ghats. But the India our travelers keep going back for is the one between the postcards: fishing villages on the Umngot River where the water is glass-clear, waterfalls you swim under alone in Meghalaya, and islands in the Andaman archipelago reached by a single slow ferry.",
        "Our favorite hidden gems: the living-root bridges of Mawlynnong, the rice-terrace villages around Kalimpong, and the pine-forest trails of Kodaikanal that most tour operators skip.",
        "The best way to see them? Give yourself one extra week and let us link the quiet places together with short, scenic hops — so you spend less time in transit and more time with your feet in the sand.",
      ],
    },
    {
      slug: "a-guide-to-indias-coastal-escapes",
      image: "/travel-images/0fa4c41f84e6f6e70057623bc670741c.jpg",
      title: "A Guide to India's Coastal Escapes",
      date: "Nov 18, 2025",
      category: "Coastal",
      excerpt:
        "From cliffside Konkan villages to serene Kerala backwaters — here is how to choose the right Indian coastline for your next reset.",
      body: [
        "A great coastal trip is decided long before you arrive — in the choice of shoreline. Secluded wild beaches suit big-group getaways; cliffside Konkan towns suit slow, romantic weeks; Andaman's white-sand islands suit total switch-off.",
        "Our Goa-to-Gokarna drive pairs a coastal road with cliff-perched villages that tumble toward the Arabian Sea. For pure calm, the Kerala backwaters let you drift past coconut groves from your own houseboat, no road required.",
        "Whatever kind of reset you need, we match the coast to the pace you want — and book the stays that come with the views everyone else pays extra for.",
      ],
    },
    {
      slug: "mountain-trails-worth-the-climb",
      image: "/travel-images/1babc905994f380026708c0f1c038d8c.jpg",
      title: "Mountain Trails Worth the Climb",
      date: "Oct 30, 2025",
      category: "Adventure",
      excerpt:
        "Five trails where the effort is rewarded with views, silence, and a detour into the best local chai.",
      body: [
        "The best mountain trails reward more than your knees. They end in summit breakfasts, hidden teahouses, or ridge views that make the whole climb feel like a bargain.",
        "We build itineraries that take you up gently and feed you well: alpine pastures in Kashmir's Gulmarg, high passes in Ladakh's Markha Valley, and ridgeline walks above the clouds in Sikkim's Gurudongmar trail.",
        "A well-planned trek isn't about raw difficulty — it's about pacing, altitude, and good boots. We handle the logistics; you handle the photos.",
      ],
    },
    {
      slug: "chasing-golden-hour-across-the-horizon",
      image: "/travel-images/911f4d44cff2a44ffe3c206589fa738f.jpg",
      title: "Chasing Golden Hour Across the Horizon",
      date: "Nov 28, 2025",
      category: "Photography",
      excerpt:
        "The light is the real travel guide. Our favorite places to watch the day begin and end beautifully.",
      body: [
        "Dawn and dusk turn ordinary places extraordinary. On Radhanagar Beach, the sunset is practically a civic event — everyone drifts to the water's edge to watch the sky catch fire.",
        "For sunrise, nothing beats a Lakshadweep sandbank at low tide, or the first light hitting the Himalaya ridgelines before the valley wakes up.",
        "Golden hour is also the best time for the least-effort travel photography. We schedule the sights worth photographing around the light, and leave the midday for siestas and good food.",
      ],
    },
    {
      slug: "city-lights-mumbai-after-dark",
      image: "/travel-images/b55e27b99cc7b9ac2a9880e6087c8dc7.jpg",
      title: "City Lights: Mumbai After Dark",
      date: "Nov 10, 2025",
      category: "India",
      excerpt:
        "Marine Drive, street-food lanes and a city that sleeps less than you'd think.",
      body: [
        "Mumbai glows. By the time most cities dim, the lights of Marine Drive and the crowds of Colaba Causeway are just warming up.",
        "Our after-dark itinerary: dinner on Mohammed Ali Road, a walk along the Queen's Necklace, and a late-night rooftop in Bandra for a skyline that counts its lights in millions.",
        "It's a city that rewards staying up — and staying an extra day. Two nights in Mumbai is enough to see it; four is enough to love it.",
      ],
    },
    {
      slug: "road-trip-essentials-the-konkan-coast",
      image: "/travel-images/fc1d3bb67539b24e1f0a73cf4f603488.jpg",
      title: "Road Trip Essentials: The Konkan Coast",
      date: "Oct 15, 2025",
      category: "Road Trips",
      excerpt:
        "Hairpins, kokum and tiny coastal villages — what to pack and where to stop on Maharashtra's prettiest drive.",
      body: [
        "The Konkan is a slow road: cliffside hairpins, villages stacked on the hillside, and every curve a photo opportunity (though the driver will want to keep eyes on the road).",
        "Start in Alibaug, stop in Ganpatipule for lunch and a swim, and save the golden hour for the lighthouse at Ratnagiri.",
        "Pack light bags, comfortable shoes, and an appetite for kokum sherbet — the coast is best taken leisurely, and we'll point out the stops most drivers miss.",
      ],
    },
  ],
  testimonials: [
    {
      id: 1,
      name: "Arman Kabir",
      role: "Solo Explorer · Goa",
      quote:
        "Movade turned a vague idea of “somewhere warm” into the best two weeks of my year.",
      photo: "/review/20303b5f6f2cf43506bb6d88e4ad0d93.jpg",
      x: -330,
      y: -110,
      objectPos: "50% 14%",
      duration: 7,
    },
    {
      id: 2,
      name: "Rafiul Hasan",
      role: "Verified Traveler · Jaipur",
      quote:
        "Every detail was planned so well I never once opened Google Maps in Jaipur.",
      photo: "/review/355ed0f15a82c42abe7e51bba1d34606.jpg",
      x: -110,
      y: -170,
      objectPos: "50% 16%",
      duration: 8,
    },
    {
      id: 3,
      name: "Imran Chowdhury",
      role: "Family Trip · Pondicherry",
      quote:
        "Traveling with kids is stressful — Movade's team handled everything so we didn't have to.",
      photo: "/review/39202174545c29bfbdb0bb981ed6e766.jpg",
      x: 150,
      y: -155,
      objectPos: "50% 14%",
      duration: 6.5,
    },
    {
      id: 4,
      name: "Tahsin Ahmed",
      role: "Honeymoon · Andaman",
      quote:
        "The sunset dinner they arranged on Radhanagar is a memory we'll keep for life.",
      photo: "/review/3e62508b466da1db86ac9ba0dd940490.jpg",
      x: 350,
      y: -75,
      objectPos: "50% 15%",
      duration: 7.5,
    },
    {
      id: 5,
      name: "Sabbir Rahman",
      role: "Business Traveler · Mumbai",
      quote:
        "Fast rebooking when my flight changed last minute. Genuinely felt taken care of.",
      photo: "/review/785ca2f82448ff5b842b12e56cc1b393.jpg",
      x: -370,
      y: 80,
      objectPos: "50% 13%",
      duration: 6,
    },
    {
      id: 6,
      name: "Nabil Hossain",
      role: "Adventure Seeker · Meghalaya",
      quote:
        "They found a hiking route no other agency mentioned. Absolute hidden gem.",
      photo: "/review/a583c395a9133f31190311989d79caa9.jpg",
      x: -90,
      y: 210,
      objectPos: "50% 16%",
      duration: 8.5,
    },
    {
      id: 7,
      name: "Fahim Islam",
      role: "Return Client · Konkan Coast",
      quote:
        "Third trip booked with Movade and it keeps getting better. Never going elsewhere.",
      photo: "/review/b6ec85be9c5a41cd707f80aa5995c7b6.jpg",
      x: 170,
      y: 190,
      objectPos: "50% 14%",
      duration: 7,
    },
    {
      id: 8,
      name: "Zayan Karim",
      role: "Weekend Getaway · Manali",
      quote:
        "Even a short weekend trip felt curated and effortless from start to finish.",
      photo: "/review/e293a27e36a2757509b589c23943616c.jpg",
      x: 390,
      y: 70,
      objectPos: "50% 15%",
      duration: 6.8,
    },
  ],
  bookings: [],
  consultations: [],
  subscribers: [],
  users: [],
};

async function readStore(): Promise<AppData> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      ...seedData,
      ...parsed,
      destinations: parsed.destinations ?? seedData.destinations,
      properties: parsed.properties ?? seedData.properties,
      spots: parsed.spots ?? seedData.spots,
      blogs: parsed.blogs ?? seedData.blogs,
      testimonials: parsed.testimonials ?? seedData.testimonials,
      bookings: parsed.bookings ?? [],
      consultations: parsed.consultations ?? [],
      subscribers: parsed.subscribers ?? [],
      users: parsed.users ?? [],
    };
  } catch {
    return structuredClone(seedData);
  }
}

export async function getStore(): Promise<AppData> {
  return readStore();
}

export async function updateStore(
  mutate: (data: AppData) => void
): Promise<AppData> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const data = await readStore();
  mutate(data);
  const raw = JSON.stringify(data, null, 2);
  await fs.writeFile(DATA_FILE, raw, "utf-8");
  return data;
}

export async function nextId(
  data: { id: string | number }[],
  prefix: string
): Promise<string> {
  const max = data.reduce((acc, item) => {
    const n = Number(item.id);
    if (typeof item.id === "number" || !Number.isNaN(n)) {
      return Math.max(acc, n);
    }
    const m = Number(String(item.id).split("-").pop());
    return Number.isNaN(m) ? acc : Math.max(acc, m);
  }, 0);
  return `${prefix}-${max + 1}`;
}