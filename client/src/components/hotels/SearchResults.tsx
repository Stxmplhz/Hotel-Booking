import { useState, useEffect } from "react";
import type { Hotel } from '../../types';
import { getHotels } from '../../services/api';
import { useLocation } from "react-router-dom";
import { FilterSidebar } from "./FilterSidebar";
import { HotelResultCard } from "./HotelResultCard";

export function SearchResults() {
  const location = useLocation();

  // Receive input from SearchBar
  const [destination, setDestination] = useState(location.state?.destination || "");
  const [dates, setDates] = useState(location.state?.dates || []);
  const [options, setOptions] = useState(location.state?.options || { adult: 1 });

  const [hotelResults, setHotelResults] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [freeCancellationOnly, setFreeCancellationOnly] = useState<boolean>(false);

  // Fetch Data from API
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true); 
      try {
        const searchParams = {
            city: destination,
            minPeople: options.adult, 
            checkIn: dates[0] || undefined, 
            checkOut: dates[1] || undefined, 
        };

        const data = await getHotels(searchParams);
        setHotelResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); 
      }
    };

    fetchHotels();
  }, [destination, dates, options]); 

  // Handle New Search
  useEffect(() => {
     if (location.state) {
        setDestination(location.state.destination);
        setDates(location.state.dates);
        setOptions(location.state.options);
     }
  }, [location]);

  // Client-side Filtering
  const filteredHotels = hotelResults.filter((hotel) => {
    const matchPrice = 
      hotel.cheapestPrice >= priceRange[0] && 
      hotel.cheapestPrice <= priceRange[1];

    const matchAmenities = selectedAmenities.length === 0 || 
      selectedAmenities.every((amenity) => 
        hotel.amenities?.includes(amenity)
      );

    const matchStars = selectedStars.length === 0 || 
      selectedStars.includes(Math.floor(hotel.rating || 0));

    const matchType = selectedTypes.length === 0 || 
      (hotel.type && selectedTypes.includes(hotel.type));

    const matchMinRating = (hotel.rating || 0) >= minRating;

    const matchCancellation = !freeCancellationOnly || 
      hotel.amenities?.includes("Free Cancellation") || 
      hotel.amenities?.includes("Free cancellation");
            
      return matchPrice && matchAmenities && matchStars && matchType && matchMinRating && matchCancellation;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-400 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl text-gray-900 dark:text-white mb-2">Search Results</h1>
          <p className="text-gray-600 dark:text-gray-400">{filteredHotels.length} properties found</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-80 flex-shrink-0">
            <FilterSidebar
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
              selectedStars={selectedStars}
              setSelectedStars={setSelectedStars}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              minRating={minRating}
              setMinRating={setMinRating}
              freeCancellationOnly={freeCancellationOnly}
              setFreeCancellationOnly={setFreeCancellationOnly}
              resultCount={filteredHotels.length}
            />
          </aside>

          {/* Results List */}
          <main className="flex-1">
            <div className="space-y-6">
              {filteredHotels.map((hotel) => (
                <HotelResultCard key={hotel._id} hotel={hotel} />
              ))}

              {filteredHotels.length === 0 && !loading && (
                <div className="text-center text-gray-500 mt-10">
                  No hotels found matching your filters.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}