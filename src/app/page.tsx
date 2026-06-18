import dynamic from "next/dynamic";
import { Preloader } from "@/components/home/preloader";
import { Hero } from "@/components/home/hero";

const SelectedWorks = dynamic(() => import("@/components/home/selected-works").then(mod => mod.SelectedWorks), { ssr: true });
const AboutArtist = dynamic(() => import("@/components/home/about-artist").then(mod => mod.AboutArtist), { ssr: true });
const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer), { ssr: true });
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

