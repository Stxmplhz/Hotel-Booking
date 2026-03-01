import { Star } from 'lucide-react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterSidebarProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  selectedStars: number[];
  setSelectedStars: (stars: number[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  freeCancellationOnly: boolean;
  setFreeCancellationOnly: (value: boolean) => void;
  resultCount: number;
}

const amenitiesList = [
  'Free WiFi',
  'Restaurant',
  'Room Service',
  'Breakfast',
  'Swimming Pool',
  'Fitness Center',
  'Parking',
  'Bar',
  'Lounge',
  'Spa',
  'Pet Friendly',
  'Airport Shuttle',
  'Traditional Massage',
];

const propertyTypes = ['Hotel', 'Resort', 'Boutique', 'Suite'];

const guestRatings = [
  { label: 'Excellent: 4.5+', value: 4.5 },
  { label: 'Very Good: 4.0+', value: 4.0 },
  { label: 'Good: 3.5+', value: 3.5 },
  { label: 'Any', value: 0 }
];

export function FilterSidebar({
  priceRange,
  setPriceRange,
  selectedAmenities,
  setSelectedAmenities,
  selectedStars,
  setSelectedStars,
  selectedTypes,
  setSelectedTypes,
  minRating,
  setMinRating,
  freeCancellationOnly,
  setFreeCancellationOnly,
  resultCount
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    price: true,
    stars: true,
    propertyType: true,
    guestRating: true,
    amenities: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAmenityChange = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleStarChange = (stars: number, checked: boolean) => {
    if (checked) {
      setSelectedStars([...selectedStars, stars]);
    } else {
      setSelectedStars(selectedStars.filter((s) => s !== stars));
    }
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, type]);
    } else {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    }
  };

  const handleMinPriceChange = (value: number) => {
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (value: number) => {
    setPriceRange([priceRange[0], value]);
  };

  const clearAllFilters = () => {
    setPriceRange([0, 500]);
    setSelectedAmenities([]);
    setSelectedStars([]);
    setSelectedTypes([]);
    setMinRating(0);
    setFreeCancellationOnly(false);
  };

   const hasActiveFilters = 
    priceRange[0] !== 0 || 
    priceRange[1] !== 500 || 
    selectedAmenities.length > 0 || 
    selectedStars.length > 0 || 
    selectedTypes.length > 0 || 
    minRating > 0 || 
    freeCancellationOnly;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-gray-900 dark:text-white">Filters</h2>
          {hasActiveFilters && (
            <button 
              onClick={clearAllFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-white font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Free Cancellation */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="free-cancellation"
              checked={freeCancellationOnly}
              onChange={(e) => setFreeCancellationOnly(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="free-cancellation"
              className="text-sm cursor-pointer text-gray-700 dark:text-white"
            >
              Free cancellation
            </label>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Price Range Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-gray-900 dark:text-white">Price per night</h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 dark:text-white transition-transform ${
                openSections.price ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {openSections.price && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Min: ${priceRange[0]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Max: ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2 px-1">
                <span className="text-sm text-gray-700 dark:text-gray-400">${priceRange[0]}</span>
                <span className="text-sm text-gray-500 dark:text-gray-200">-</span>
                <span className="text-sm text-gray-700 dark:text-gray-400">${priceRange[1]}</span>
              </div>
            </div>
          )}
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Star Rating Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('stars')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-gray-900 dark:text-white">Star Rating</h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 dark:text-white transition-transform ${
                openSections.stars ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {openSections.stars && (
            <div className="space-y-3">
              {[5, 4, 3].map((stars) => (
                <div key={stars} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`stars-${stars}`}
                    checked={selectedStars.includes(stars)}
                    onChange={(e) => handleStarChange(stars, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor={`stars-${stars}`}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Property Type Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('propertyType')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-gray-900 dark:text-white">Property Type</h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 dark:text-white transition-transform ${
                openSections.propertyType ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {openSections.propertyType && (
            <div className="space-y-3">
              {propertyTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`type-${type}`}
                    checked={selectedTypes.includes(type)}
                    onChange={(e) => handleTypeChange(type, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor={`type-${type}`} className="cursor-pointer text-gray-700 dark:text-white">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Guest Rating Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('guestRating')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-gray-900 dark:text-white">Guest Rating</h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 dark:text-white transition-transform ${
                openSections.guestRating ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {openSections.guestRating && (
            <div className="space-y-2">
              {guestRatings.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => setMinRating(rating.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    minRating === rating.value
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:text-gray-400 dark:bg-gray-700'
                      : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {rating.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <hr className="my-6 border-gray-200" />
        
        {/* Amenities Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('amenities')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-gray-900 dark:text-white">Amenities</h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                openSections.amenities ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {openSections.amenities && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor={`amenity-${amenity}`} className="cursor-pointer text-gray-700 dark:text-gray-400">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Show Results Button - Mobile */}
      <div className="lg:hidden border-t border-gray-200 p-4">
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Show {resultCount} {resultCount === 1 ? 'Result' : 'Results'}
        </button>
      </div>
    </div>
  );
}
