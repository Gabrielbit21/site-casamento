import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import WeddingDetails from "@/components/WeddingDetails";
import Gifts from "@/components/Gifts";
import FloatingRSVP from "@/components/FloatingRSVP";
import RSVPModal from "@/components/RSVPModal";

export default function Home() {
  return (
    <main>
      <Hero />

      <Gallery />

      <WeddingDetails />

      <Gifts />

      <FloatingRSVP />

      <RSVPModal />
    </main>
  );
}