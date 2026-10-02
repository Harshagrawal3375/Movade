"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth-context";
import * as api from "@/lib/api";
import { useRouter } from "next/navigation";

export interface BookingPayload {
  packageTitle: string;
  packageType: string;
  destination: string;
  checkout?: string;
}

const inputCls =
  "w-full rounded-xl border border-border-subtle bg-white px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted/60 focus:border-accent-green focus:ring-2 focus:ring-accent-green/30";

const sectionCls = "pt-1 text-sm font-bold uppercase tracking-wide text-accent-green";

const addDays = (date: string, days: number): string => {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const diffDays = (start: string, end: string): number => {
  const s = new Date(`${start}T12:00:00`).getTime();
  const e = new Date(`${end}T12:00:00`).getTime();
  return Math.round((e - s) / 86400000);
};

const inr = (n: number) =>
  `₹${Math.round(n).toLocaleString("en-IN")}`;

// ── Exact option sets required by spec ──────────────────────────────
const DESTINATION_OPTIONS = [
  "Manali",
  "Kashmir",
  "Jaipur",
  "Agra",
  "Mumbai",
  "Kerala",
  "Goa",
] as const;

const TRAVEL_MODE_OPTIONS = [
  "Flight",
  "Bus",
  "Cab / Private Taxi",
  "Train",
  "Shared Coaches",
  "Other",
] as const;

const HOTEL_CATEGORY_OPTIONS = [
  "Budget (2★)",
  "Comfort (3★)",
  "Premium (4★)",
  "Luxury (5★)",
] as const;

const ROOM_TYPE_OPTIONS = [
  "Single",
  "Double",
  "Twin",
  "Triple",
  "Family / Suite",
] as const;

// ── Fare engine (transparent, deterministic) ─────────────────────────
const DESTINATION_BASE: Record<string, { transport: number; stayMultiplier: number }> = {
  Manali: { transport: 4500, stayMultiplier: 1.0 },
  Kashmir: { transport: 8500, stayMultiplier: 1.2 },
  Jaipur: { transport: 3500, stayMultiplier: 0.9 },
  Agra: { transport: 3000, stayMultiplier: 0.85 },
  Mumbai: { transport: 7000, stayMultiplier: 1.3 },
  Kerala: { transport: 9000, stayMultiplier: 1.25 },
  Goa: { transport: 7500, stayMultiplier: 1.15 },
};

const TRAVEL_MODE_MULTIPLIER: Record<string, number> = {
  Flight: 1.6,
  Bus: 0.7,
  "Cab / Private Taxi": 1.25,
  Train: 1.0,
  "Shared Coaches": 0.6,
  Other: 1.0,
};

const HOTEL_RATE_PER_NIGHT: Record<string, number> = {
  "Budget (2★)": 2000,
  "Comfort (3★)": 3200,
  "Premium (4★)": 5200,
  "Luxury (5★)": 8000,
};

const ROOM_OCCUPANCY: Record<string, number> = {
  Single: 1,
  Double: 2,
  Twin: 2,
  Triple: 3,
  "Family / Suite": 4,
};

// ── Real Indian GST (GST 2.0, w.e.f. 22 Sept 2025) ────────────────────
// Transport (SAC 9964 – passenger transport services):
// • Flight economy: 5% (CGST 2.5% + SGST 2.5%, no ITC)
// • Rail AC / AC bus & contract carriage / radio taxi / motorcab (fuel incl.): 5%
// • Non-economy air (business/first) is 18%, but this form quotes economy
//   fares, so every travel mode below is 5% IRL.
// Hotel accommodation (on actual room value per night):
// • Room value ≤ ₹7,500/night: 5% (cut from 12% under GST 2.0)
// • Room value > ₹7,500/night: 18%
const TRANSPORT_GST_RATE: Record<string, number> = {
  Flight: 0.05,
  Bus: 0.05,
  "Cab / Private Taxi": 0.05,
  Train: 0.05,
  "Shared Coaches": 0.05,
  Other: 0.05,
};

const HOTEL_GST_SLAB_THRESHOLD = 7500;

function hotelGstRate(effectiveNightlyPerRoom: number): number {
  return effectiveNightlyPerRoom > HOTEL_GST_SLAB_THRESHOLD ? 0.18 : 0.05;
}

type DestinationOption = (typeof DESTINATION_OPTIONS)[number];
type TravelMode = (typeof TRAVEL_MODE_OPTIONS)[number];
type HotelCategory = (typeof HOTEL_CATEGORY_OPTIONS)[number];
type RoomType = (typeof ROOM_TYPE_OPTIONS)[number];

function resolveDestination(raw: string | undefined): DestinationOption {
  if (raw && (DESTINATION_OPTIONS as readonly string[]).includes(raw)) {
    return raw as DestinationOption;
  }
  return "Manali";
}

export default function BookingForm({ payload }: { payload: BookingPayload }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  // ── 1. Lead Traveller & Contact Details ──
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [infants, setInfants] = useState("0");

  // ── 2. Trip & Route Details ──
  // Fixed default: Delhi (locked dropdown, Delhi pre-selected)
  const [departureCity] = useState("Delhi");
  const [destination, setDestination] = useState<DestinationOption>(() =>
    resolveDestination(payload?.destination)
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalDays, setTotalDays] = useState("5");

  // ── 3. Travel & Stay Preferences ──
  const [travelMode, setTravelMode] = useState<TravelMode>("Flight");
  const [hotelCategory, setHotelCategory] = useState<HotelCategory>("Comfort (3★)");
  const [roomType, setRoomType] = useState<RoomType>("Double");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setError("");
    setSubmitting(false);
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setDestination(resolveDestination(payload?.destination));
    if (payload?.checkout) {
      setStartDate(payload.checkout);
      const days = Number(totalDays || 5);
      setEndDate(addDays(payload.checkout, days));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, user]);

  const numAdults = Math.max(0, Number(adults || 0));
  const numChildren = Math.max(0, Number(children || 0));
  const numInfants = Math.max(0, Number(infants || 0));
  const totalGuests = numAdults + numChildren + numInfants;

  // Duration: prefer explicit date range, fall back to Total Days field.
  const tripDays = useMemo(() => {
    if (startDate && endDate && endDate > startDate) return diffDays(startDate, endDate);
    const d = Number(totalDays || 0);
    return Number.isFinite(d) && d > 0 ? Math.floor(d) : 0;
  }, [startDate, endDate, totalDays]);

  const nights = Math.max(0, tripDays);

  // ── 4. Automated Fare Generation ──
  const fare = useMemo(() => {
    const dest = DESTINATION_BASE[destination] ?? DESTINATION_BASE.Manali;
    const modeMult = TRAVEL_MODE_MULTIPLIER[travelMode] ?? 1;
    const nightlyRate = HOTEL_RATE_PER_NIGHT[hotelCategory] ?? 4000;
    const occupancy = ROOM_OCCUPANCY[roomType] ?? 2;

    // Infants travel/stay free; children count as 0.5 paying unit for transport.
    const payingUnits = numAdults + numChildren * 0.5;
    const transport = dest.transport * modeMult * payingUnits;

    // Rooms needed from occupancy (at least 1 room when there is 1+ guest).
    const headcountForRooms = Math.max(1, numAdults + numChildren);
    const rooms = totalGuests > 0 ? Math.max(1, Math.ceil(headcountForRooms / occupancy)) : 0;
    const accommodation = nightlyRate * dest.stayMultiplier * rooms * nights;

    // Real IRL taxes: GST per component, not a flat rate.
    const effectiveNightlyPerRoom = nightlyRate * dest.stayMultiplier;
    const transportGstRate = TRANSPORT_GST_RATE[travelMode] ?? 0.05;
    const hotelRate = hotelGstRate(effectiveNightlyPerRoom);
    const transportGst = transport * transportGstRate;
    const hotelGst = accommodation * hotelRate;
    const taxesFees = transportGst + hotelGst;
    const total = transport + accommodation + taxesFees;

    return {
      transport,
      accommodation,
      transportGst,
      hotelGst,
      taxesFees,
      total,
      rooms,
      payingUnits,
      transportGstRate,
      hotelGstRate: hotelRate,
      effectiveNightlyPerRoom,
    };
  }, [destination, travelMode, hotelCategory, roomType, numAdults, numChildren, totalGuests, nights]);

  const fareReady = tripDays > 0 && totalGuests > 0;

  const handleStartChange = (v: string) => {
    setStartDate(v);
    const days = Number(totalDays || 0);
    if (v && days > 0) {
      setEndDate(addDays(v, Math.floor(days)));
    } else if (v && endDate && endDate <= v) {
      setEndDate(addDays(v, 1));
      setTotalDays("1");
    }
  };

  const handleEndChange = (v: string) => {
    setEndDate(v);
    if (startDate && v && v > startDate) {
      setTotalDays(String(diffDays(startDate, v)));
    }
  };

  const handleTotalDaysChange = (v: string) => {
    setTotalDays(v);
    const days = Number(v || 0);
    if (startDate && Number.isFinite(days) && days > 0) {
      setEndDate(addDays(startDate, Math.floor(days)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!startDate || !endDate) {
      setError("Please select both start date and end date (or enter total days).");
      setSubmitting(false);
      return;
    }
    if (endDate <= startDate) {
      setError("End date must be after the start date.");
      setSubmitting(false);
      return;
    }
    if (numAdults < 1) {
      setError("At least 1 adult is required.");
      setSubmitting(false);
      return;
    }

    try {
      // Step 1 — reserve: booking is saved as "pending", no charge yet.
      const res = await api.createBooking({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        nationality: "Indian",
        adults: numAdults,
        children: numChildren,
        infants: numInfants,
        guests: totalGuests,
        checkIn: startDate,
        checkOut: endDate,
        packageTitle: payload.packageTitle,
        packageType: payload.packageType,
        destination,
        departureCity,
        travelMode,
        flightClass: travelMode,
        hotelStar: hotelCategory,
        roomType,
        estimatedFare: Math.round(fare.total),
      });
      showToast("Booking request received!", "success", "🎟️");
      router.push(`/booking-confirmed?booking=${res.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const labelCls = "mb-1.5 block text-sm font-medium text-text-primary";

  const pillCls = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
      active
        ? "border-text-primary bg-text-primary text-white"
        : "border-border-subtle text-text-primary hover:border-text-primary"
    }`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* ── 1. Lead Traveller & Contact Details ── */}
      <div>
        <h3 className={sectionCls}>1. Lead Traveller &amp; Contact Details</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="bk-name" className={labelCls}>
              Name (Full Name as per ID) <span className="text-red-500">*</span>
            </label>
            <input
              id="bk-name"
              required
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name as per ID"
            />
          </div>
          <div>
            <label htmlFor="bk-email" className={labelCls}>
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="bk-email"
              type="email"
              required
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="bk-phone" className={labelCls}>
              Phone / Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              id="bk-phone"
              type="tel"
              required
              className={inputCls}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label htmlFor="bk-adults" className={labelCls}>
              Adults <span className="text-red-500">*</span>
            </label>
            <input
              id="bk-adults"
              type="number"
              min={1}
              max={40}
              required
              className={inputCls}
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="bk-children" className={labelCls}>
              Children
            </label>
            <input
              id="bk-children"
              type="number"
              min={0}
              max={40}
              className={inputCls}
              value={children}
              onChange={(e) => setChildren(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="bk-infants" className={labelCls}>
              Infants
            </label>
            <input
              id="bk-infants"
              type="number"
              min={0}
              max={40}
              className={inputCls}
              value={infants}
              onChange={(e) => setInfants(e.target.value)}
            />
          </div>
          <p className="text-xs text-text-muted sm:col-span-2">
            Number of People: {totalGuests} traveller{totalGuests === 1 ? "" : "s"}
            {numInfants > 0 ? " (infants travel free)" : ""}
          </p>
        </div>
      </div>

      {/* ── 2. Trip & Route Details ── */}
      <div>
        <h3 className={sectionCls}>2. Trip &amp; Route Details</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bk-pickup" className={labelCls}>
              Pickup Location / Departure City
            </label>
            <select id="bk-pickup" className={inputCls} value={departureCity} disabled aria-label="Pickup location (fixed to Delhi)">
              <option value="Delhi">Delhi</option>
            </select>
            <p className="mt-1 text-xs text-text-muted">Fixed departure city: Delhi</p>
          </div>
          <div>
            <label htmlFor="bk-destination" className={labelCls}>
              Destination <span className="text-red-500">*</span>
            </label>
            <select
              id="bk-destination"
              required
              className={inputCls}
              value={destination}
              onChange={(e) => setDestination(e.target.value as DestinationOption)}
            >
              {DESTINATION_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="bk-start" className={labelCls}>
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              id="bk-start"
              type="date"
              required
              className={inputCls}
              value={startDate}
              onChange={(e) => handleStartChange(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="bk-end" className={labelCls}>
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              id="bk-end"
              type="date"
              required
              min={startDate || undefined}
              className={inputCls}
              value={endDate}
              onChange={(e) => handleEndChange(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="bk-days" className={labelCls}>
              Total Days
            </label>
            <input
              id="bk-days"
              type="number"
              min={1}
              max={60}
              className={inputCls}
              value={totalDays}
              onChange={(e) => handleTotalDaysChange(e.target.value)}
              placeholder="e.g. 5"
            />
          </div>
          <p className="text-xs text-text-muted sm:self-end">
            Weekend Duration: {tripDays > 0 ? `${tripDays} day${tripDays === 1 ? "" : "s"} (${nights} night${nights === 1 ? "" : "s"})` : "select dates or enter total days"}
          </p>
        </div>
      </div>

      {/* ── 3. Travel & Stay Preferences ── */}
      <div>
        <h3 className={sectionCls}>3. Travel &amp; Stay Preferences</h3>
        <div className="mt-3 flex flex-col gap-4">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-text-primary">
              Travel Mode <span className="text-red-500">*</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_MODE_OPTIONS.map((m) => (
                <button key={m} type="button" onClick={() => setTravelMode(m)} className={pillCls(travelMode === m)}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-text-primary">
              Hotel Category <span className="text-red-500">*</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {HOTEL_CATEGORY_OPTIONS.map((h) => (
                <button key={h} type="button" onClick={() => setHotelCategory(h)} className={pillCls(hotelCategory === h)}>
                  {h}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-text-primary">
              Room Type <span className="text-red-500">*</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {ROOM_TYPE_OPTIONS.map((r) => (
                <button key={r} type="button" onClick={() => setRoomType(r)} className={pillCls(roomType === r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Automated Fare Generation ── */}
      <div>
        <h3 className={sectionCls}>4. Estimated Fare</h3>
        <div className="mt-3 rounded-2xl border border-border-subtle bg-neutral-50 p-4">
          {fareReady ? (
            <>
              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-text-muted">Transport ({travelMode} · {destination})</dt>
                  <dd className="font-medium text-text-primary">{inr(fare.transport)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-text-muted">
                    Accommodation ({hotelCategory} · {roomType} × {fare.rooms} room{fare.rooms === 1 ? "" : "s"} × {nights} night{nights === 1 ? "" : "s"})
                  </dt>
                  <dd className="font-medium text-text-primary">{inr(fare.accommodation)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-text-muted">Transport GST ({Math.round(fare.transportGstRate * 100)}% · SAC 9964)</dt>
                  <dd className="font-medium text-text-primary">{inr(fare.transportGst)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-text-muted">
                    Hotel GST ({Math.round(fare.hotelGstRate * 100)}% · {inr(fare.effectiveNightlyPerRoom)}/night {fare.effectiveNightlyPerRoom > 7500 ? "> ₹7,500 slab" : "≤ ₹7,500 slab"})
                  </dt>
                  <dd className="font-medium text-text-primary">{inr(fare.hotelGst)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-text-muted">Taxes &amp; Fees (total GST)</dt>
                  <dd className="font-medium text-text-primary">{inr(fare.taxesFees)}</dd>
                </div>
                <div className="mt-1 flex items-center justify-between border-t border-border-subtle pt-3">
                  <dt className="font-semibold text-text-primary">Total Fare</dt>
                  <dd className="text-lg font-bold text-text-primary">{inr(fare.total)}</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                Live estimate for {totalGuests} traveller{totalGuests === 1 ? "" : "s"} · {tripDays} day{tripDays === 1 ? "" : "s"} · {destination} from Delhi.
                Children at 50% transport, infants free. GST 2.0 rates (22 Sept 2025): transport 5%, hotel {Math.round(fare.hotelGstRate * 100)}%.
                Final price confirmed by our team.
              </p>
            </>
          ) : (
            <p className="text-sm text-text-muted">
              Select destination, group size, trip dates and preferences to see your live fare breakdown here.
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-green px-6 py-3.5 text-sm font-semibold text-text-primary transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting
          ? "Submitting your request…"
          : fareReady
            ? `Request booking · ${inr(fare.total)}`
            : "Request booking"}
      </button>
    </form>
  );
}
