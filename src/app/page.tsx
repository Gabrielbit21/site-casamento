import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import StoryTransition from "@/components/StoryTransition";
import WeddingDetails from "@/components/WeddingDetails";
import MomentsFeed from "@/components/MomentsFeed";
import Gifts from "@/components/Gifts";
import FloatingMenu from "@/components/FloatingMenu";
import RSVPModal from "@/components/RSVPModal";

export default function Home() {
  return (
    <main>
      <Hero />

      <div id="fotos">
        <Gallery />
      </div>

      <StoryTransition />

      <div id="casamento">
        <WeddingDetails />
      </div>

      <div id="momentos">
        <MomentsFeed />
      </div>

      <Gifts />

      <FloatingMenu />

      <RSVPModal />
    </main>
  );
}