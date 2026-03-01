import { HeroSection } from '../components/home/HeroSection';
import { FeaturedHotels } from '../components/home/FeaturedHotels';

export function Home() {
  return (
    <main className="w-full max-w-8xl mx-auto min-h-[90vh]">
      <HeroSection />
    
      <div className="my-1">
        <FeaturedHotels />
      </div>
    </main>
  );
}