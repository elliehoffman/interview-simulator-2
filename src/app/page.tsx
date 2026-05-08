import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { QuickStartCard } from "@/components/landing/QuickStartCard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">
        <HeroSection />
        <QuickStartCard />
        <FeatureGrid />
      </main>
    </div>
  );
}
