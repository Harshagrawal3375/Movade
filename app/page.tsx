import dynamic from "next/dynamic";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Footer from "@/components/footer";

function SectionFallback() {
  return <div className="w-full py-16" aria-hidden />;
}

// Below-the-fold sections are code-split so the initial bundle stays lean.
// They still SSR (default) but ship as separate chunks loaded on demand.
const ExploreEscape = dynamic(() => import("@/components/explore-escape"), {
  loading: SectionFallback,
});
const PopularDestinations = dynamic(
  () => import("@/components/popular-destinations"),
  { loading: SectionFallback }
);
const LetsDrive = dynamic(() => import("@/components/lets-drive"), {
  loading: SectionFallback,
});
const AdventuresGallery = dynamic(
  () => import("@/components/adventures-gallery"),
  { loading: SectionFallback }
);
const ParallaxGallery = dynamic(() => import("@/components/parallax-gallery"), {
  loading: SectionFallback,
});
const WhyChoose = dynamic(() => import("@/components/why-choose"), {
  loading: SectionFallback,
});
const PopularSpots = dynamic(() => import("@/components/popular-spots"), {
  loading: SectionFallback,
});
const ConstellationTestimonials = dynamic(
  () => import("@/components/constellation-testimonials"),
  { loading: SectionFallback }
);
const TravelNetwork = dynamic(() => import("@/components/travel-network"), {
  loading: SectionFallback,
});

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ExploreEscape />
        <PopularDestinations />
        <LetsDrive />
        <AdventuresGallery />
        <ParallaxGallery />
        <WhyChoose />
        <PopularSpots />
        <ConstellationTestimonials />
        <TravelNetwork />
      </main>
      <Footer />
    </>
  );
}
