import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import ExploreEscape from "@/components/explore-escape";
import PopularDestinations from "@/components/popular-destinations";
import LetsDrive from "@/components/lets-drive";
import AdventuresGallery from "@/components/adventures-gallery";
import ParallaxGallery from "@/components/parallax-gallery";
import WhyChoose from "@/components/why-choose";
import PopularSpots from "@/components/popular-spots";
import ConstellationTestimonials from "@/components/constellation-testimonials";
import TravelNetwork from "@/components/travel-network";
import Footer from "@/components/footer";

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
