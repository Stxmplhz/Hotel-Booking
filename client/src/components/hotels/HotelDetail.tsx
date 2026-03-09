import { useEffect, useState, useContext } from "react";
import { Star, StarHalf, MapPin, XCircle, Check } from "lucide-react";
import { MasonryGallery } from "../shared/MasonryGallery";
import { RoomCard } from "./RoomCard";
import type { Hotel, Room } from "../../types";
import { getIcon } from "../shared/getIcon";
import { getHotelRooms } from "../../services/api";
import { SearchContext } from "../../context/SearchContext";

interface HotelDetailProps {
  hotel: Hotel;
}

export function HotelDetail({ hotel }: HotelDetailProps) {
  const [rooms, setRooms] = useState<Room[]>([]);

  const { options } = useContext(SearchContext);
  const guests = options?.adult || 1;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getHotelRooms(hotel._id);
        setRooms(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (hotel._id) {
      fetchRooms();
    }
  }, [hotel._id]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Image Gallery */}
        <div className="mb-5">
          <MasonryGallery photos={hotel.photos} />
        </div>

        {/* Hotel Header */}
        <div className="mb-12">
          <h1 className="text-4xl text-gray-900 dark:text-white mb-4">
            {hotel.name}
          </h1>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => {
              const starValue = i + 1;
              if (hotel.rating >= starValue) {
                return (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-blue-600 text-blue-600"
                  />
                );
              } else if (hotel.rating >= starValue - 0.5) {
                return (
                  <StarHalf
                    key={i}
                    className="w-5 h-5 fill-blue-600 text-blue-600"
                  />
                );
              } else {
                return; /*<Star key={i} className="w-5 h-5 text-gray-300" />;*/
              }
            })}

            <span className="ml-2 text-sm text-gray-600 font-medium">
              {hotel.rating}
            </span>
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 text-gray-600 mb-6">
            <MapPin className="w-5 h-5 text-[#145076] dark:text-gray-400" />
            <span className="text-lg dark:text-gray-400">{hotel.address}</span>
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-white text-lg leading-relaxed mb-8 max-w-4xl">
            {hotel.description}
          </p>

          {/* Hotel Amenities */}
          <div className="mb-6">
            <h4 className="text-base text-gray-500 dark:text-gray-300 mb-3">
              Amenities
            </h4>
            <div className="flex flex-wrap gap-3">
              {hotel.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 text-base text-[#ffffff] bg-[#3c59c0] px-3 py-2 rounded-lg"
                >
                  {getIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cancelation Policy */}
          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
              hotel.cancellationPolicy?.type === "non-refundable"
                ? "bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-800"
                : "bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-800"
            }`}
          >
            {hotel.cancellationPolicy?.type === "non-refundable" ? (
              <>
                <XCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-bold text-red-700 dark:text-red-400 leading-none">
                    Non-Refundable
                  </p>
                  <p className="text-[10px] text-red-600 dark:text-red-500 mt-1 uppercase">
                    No refund on cancel
                  </p>
                </div>
              </>
            ) : (
              <>
                <Check className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-bold text-green-700 dark:text-green-400 leading-none">
                    Free Cancellation
                  </p>
                  <p className="text-[10px] text-green-600 dark:text-green-500 mt-1 uppercase">
                    Before {hotel.cancellationPolicy?.deadlineHours}h check-in
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Available Rooms Section */}
        <div>
          <div className="mb-8">
            <h2 className="text-3xl text-gray-900 dark:text-white mb-2">
              Available Rooms
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Choose from our selection of luxury rooms and suites
            </p>
          </div>

          <div className="space-y-6">
            {rooms
              .filter((room) => room.maxPeople >= guests)
              .map((room) => (
                <RoomCard key={room._id} room={room} hotel={hotel} />
              ))}

            {rooms.length > 0 &&
              rooms.filter((room) => room.maxPeople >= guests).length === 0 && (
                <div className="p-6 light:bg-yellow-50 text-red-600 rounded-lg text-center">
                  <p className="font-bold">
                    No rooms available for {guests} guests in one room.
                  </p>
                  <p className="text-sm">
                    Try splitting into multiple rooms or reducing guest count.
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
