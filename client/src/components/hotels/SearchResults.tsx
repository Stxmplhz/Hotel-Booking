import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query"; 
import type { Hotel } from "../../types";
import { getHotels } from "../../services/api";
import { FilterSidebar } from "./FilterSidebar";
import { HotelResultCard } from "./HotelResultCard";

interface HotelResponse {
  data: Hotel[];
  total: number;
  currentPage: number;
  hasNextPage: boolean;
}

export function SearchResults() {
  const location = useLocation();

  // Receive input from SearchBar
  const [destination, setDestination] = useState(location.state?.destination || "");
  const [dates, setDates] = useState(location.state?.dates || []);
  const [options, setOptions] = useState(location.state?.options || { adult: 1 });

  // Filter States
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [freeCancellationOnly, setFreeCancellationOnly] = useState<boolean>(false);

  // Handle New Search
  useEffect(() => {
    if (location.state) {
      setDestination(location.state.destination);
      setDates(location.state.dates);
      setOptions(location.state.options);
    }
  }, [location]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["hotels", destination, dates, options.adult],

    initialPageParam: 1,
    
    queryFn: async ({ pageParam = 1 }): Promise<HotelResponse> => { 
      const searchParams = {
        city: destination,
        minPeople: options.adult,
        checkIn: dates[0] || undefined,
        checkOut: dates[1] || undefined,
        limit: 5,
        page: pageParam,
      };
      return await getHotels(searchParams); 
    },
    getNextPageParam: (lastPage: HotelResponse) => {
      if (lastPage.hasNextPage) {
        return lastPage.currentPage + 1;
      }
      return undefined; 
    },
  });

  const allHotels = data?.pages.flatMap((page) => page.data) || [];

  // Client-side Filtering
  const filteredHotels = allHotels.filter((hotel: Hotel) => {
    const matchPrice = hotel.cheapestPrice >= priceRange[0] && hotel.cheapestPrice <= priceRange[1];
    const matchAmenities = selectedAmenities.length === 0 || selectedAmenities.every((amenity) => hotel.amenities?.includes(amenity));
    const matchStars = selectedStars.length === 0 || selectedStars.some((star) => hotel.rating >= star && hotel.rating < star + 1);
    const matchType = selectedTypes.length === 0 || (hotel.type && selectedTypes.includes(hotel.type));
    const matchMinRating = (hotel.rating || 0) >= minRating;
    const matchCancellation = !freeCancellationOnly || hotel.cancellationPolicy?.type === "free";

    return matchPrice && matchAmenities && matchStars && matchType && matchMinRating && matchCancellation;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-400 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl text-gray-900 dark:text-white mb-2">Search Results</h1>
          <p className="text-gray-600 dark:text-gray-400">
             Found {data?.pages[0]?.total || 0} properties (Showing {filteredHotels.length})
          </p>
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p>Finding the best stays for you...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredHotels.map((hotel: Hotel) => (
                  <HotelResultCard key={hotel._id} hotel={hotel} />
                ))}

                {filteredHotels.length === 0 && (
                  <div className="text-center text-gray-500 mt-10 p-8 bg-white rounded-xl border border-gray-200">
                    No hotels found matching your filters.
                  </div>
                )}

                {hasNextPage && (
                  <div className="flex justify-center mt-10 pb-10">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className={`px-8 py-3 rounded-xl font-semibold border-2 transition-all flex items-center justify-center
                        ${isFetchingNextPage 
                          ? "border-gray-300 text-gray-400 cursor-not-allowed" 
                          : "border-[#3c59c0] text-[#3c59c0] hover:bg-[#3c59c0] hover:text-white"
                        }`}
                    >
                      {isFetchingNextPage ? (
                        <>
                          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                          Loading...
                        </>
                      ) : (
                        "Load More Hotels"
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}