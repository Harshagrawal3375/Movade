export interface Destination {
  slug: string;
  from: string;
  to: string;
  country: string;
  date: string;
  price: string;
  image: string;
  rating: string;
  reviews: string;
  blurb: string;
  duration: string;
}

export interface Property {
  id: string;
  slug: string;
  name: string;
  category: string;
  location: string;
  city: string;
  country: string;
  pricePerNight: number;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  badge?: string;
  description: string;
}

export interface Spot {
  key: string;
  image: string;
  tag: string;
  title: string;
  rating: string;
  reviews: string;
  location: string;
  duration: string | null;
  price: string | null;
  showPrice: boolean;
  emoji: string;
  blurb: string;
}

export interface BlogPost {
  slug: string;
  image: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  photo: string;
  x: number;
  y: number;
  objectPos: string;
  duration: number;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth?: string;
  gender?: string;
  adults: number;
  children: number;
  infants: number;
  guests: number;
  checkIn: string;
  checkOut: string;
  packageTitle: string;
  packageType: string;
  destination: string;
  departureCity?: string;
  travelMode?: string;
  flightClass?: string;
  hotelStar?: string;
  roomType?: string;
  estimatedFare?: number;
  dietaryRequirements?: string;
  mealPreference?: string;
  passportNumber?: string;
  passportExpiry?: string;
  passportIssuingCountry?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  specialRequests?: string;
  notes?: string;
  // ── Payments (Razorpay, reserve-then-pay) ──
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amountPaid?: number;
  paidAt?: string;
  createdAt: string;
  status: "pending" | "confirmed";
}

export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone?: string;
  destination: string;
  budget: string;
  message?: string;
  createdAt: string;
  status: "pending";
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
}