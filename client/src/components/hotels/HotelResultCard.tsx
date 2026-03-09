import { Star, MapPin, ExternalLink } from "lucide-react";
import type { Hotel } from "../../types";
import { Link } from "react-router-dom";
import { getIcon } from "../shared/getIcon";

interface HotelResultCardProps {
  hotel: Hotel;
}

export function HotelResultCard({ hotel }: HotelResultCardProps) {
  const MAX_AMENITIES = 3;
  const visibleAmenities = hotel.amenities.slice(0, MAX_AMENITIES);
  const remainingCount = hotel.amenities.length - MAX_AMENITIES;

  return (
    <div className="bg-white dark:bg-gray-800  rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden dark:border-gray-700">
      <div className="flex flex-col md:flex-row">
        {/* Hotel Image */}
        <div className="md:w-80 h-64 md:h-auto flex-shrink-0">
          <img
            src={hotel.photos[0]}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hotel Details */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex-1">
            {/* Hotel Name */}
            <h3 className="text-2xl mb-3 text-gray-900 dark:text-white">
              {hotel.name}
            </h3>

            {/* Star Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-900 dark:text-gray-400 font-medium">
                  {hotel.rating}
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{hotel.city}</span>
              </div>
            </div>

            {/* Distance */}
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {hotel.distance}
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-white leading-relaxed mb-4">
              {hotel.description}
            </p>

            {/* Amenities */}
            <div className="text-gray-700 dark:text-white leading-relaxed mb-4">
              <h4 className="text-sm text-gray-500 dark:text-gray-300 mb-3">
                Amenities
              </h4>
              <div className="flex flex-wrap gap-3">
                {visibleAmenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-white bg-gray-50  dark:bg-[#3c59c0] px-3 py-2 rounded-lg"
                  >
                    {getIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}

                {remainingCount > 0 && (
                  <div className="flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-gray-700 dark:text-blue-300 rounded-lg">
                    +{remainingCount} more
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-400">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Price per night
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ${hotel.cheapestPrice}
              </div>
            </div>

            <Link
              to={`/hotels/${hotel._id}`}
              className=" bg-blue-600 hover:bg-blue-700 text-white dark:text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>View Deal</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
