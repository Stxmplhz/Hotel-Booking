import { useState, useEffect } from "react";
import { HotelCard } from '../shared/HotelCard.tsx';
import type { Hotel } from '../../types';
import { getFeaturedHotels } from '../../services/api';

export function FeaturedHotels() {  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getFeaturedHotels();
        setHotels(data);
      } catch (err) {
        console.error("Error fetching hotels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-5">
          <h2 className="text-4xl font-semibold mb-3 text-gray-900 dark:text-white">
            Featured Hotels
          </h2>
          <p className="text-l">
            Handpicked stays for your next adventure
          </p>
        </div>

        { loading ? (
          <div className="text-center">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        )}
        
      </div>
    </section>
  );
}

