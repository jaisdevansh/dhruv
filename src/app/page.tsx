import { Preloader } from "@/components/home/preloader";
import { Hero } from "@/components/home/hero";
import { SelectedWorks } from "@/components/home/selected-works";
import { AboutArtist } from "@/components/home/about-artist";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="flex-1 w-full bg-[var(--color-background)]">
      <Preloader />
      <Hero />
      <SelectedWorks />
      <AboutArtist />
      <Footer />
    </main>
  );
}

