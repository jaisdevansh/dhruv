import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Navbar } from "@/components/layout/navbar";
import { PortfolioProvider, ThemeStyles } from "@/components/providers/portfolio-context";
import { getPortfolioData } from "@/app/actions";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dhruv Chaurasia | Fine Arts Portfolio",
  description: "Awwwards-Level Fine Arts Portfolio by Dhruv Chaurasia",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SSR: fetch real data on the server before sending HTML to browser
  const initialData = await getPortfolioData();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--color-background)] relative" suppressHydrationWarning>
        <PortfolioProvider initialData={initialData}>
          <ThemeStyles />
          {/* Grain overlay for luxury feel */}
          <div className="noise-bg" />

          {/* Ambient spotlight glowing gradients */}
          <div className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0" />

          <Navbar />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </PortfolioProvider>
      </body>
    </html>
  );
}

