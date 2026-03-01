import { SearchBar } from '../shared/SearchBar.tsx';
import heroBg from '../../assets/herosection-bg.jpeg';

export function HeroSection() {
  return (
    <section className="relative h-[550px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10 w-full max-w-6xl px-6">
        <div className="text-center mb-8">
          <h1 className="text-white font-semibold text-5xl md:text-6xl mb-4">
            Find Your Perfect Stay
          </h1>
          <p className="text-white/90 text-xl">
            Discover amazing hotels and resorts for your next adventure
          </p>
        </div>
        
        <SearchBar variant="home" />
      </div>
    </section>
  );
}

