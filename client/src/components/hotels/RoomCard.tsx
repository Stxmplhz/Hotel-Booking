import { BedDouble, Users, Maximize2 } from "lucide-react";
import type { Room, Hotel } from "../../types";
import { getIcon } from "../shared/getIcon";
import { useState, useContext } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import { getDatesInRange } from "../../utils/time";

interface RoomCardProps {
  room: Room;
  hotel: Hotel;
}

export function RoomCard({ room, hotel }: RoomCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number | null>(
    null,
  );
  const navigate = useNavigate();

  const { user, openAuthModal } = useContext(AuthContext);

  const { dates } = useContext(SearchContext);
  const hasDates = dates && dates.length > 0 && dates[0]?.startDate;
  const alldates =
    dates && dates[0]
      ? getDatesInRange(dates[0].startDate, dates[0].endDate)
      : [];

  const isAvailable = (roomNumber: any) => {
    if (
      !roomNumber.unavailableDates ||
      roomNumber.unavailableDates.length === 0
    )
      return true;
    const roomDates = roomNumber.unavailableDates.map(
      (d: string | Date) => new Date(d).toISOString().split("T")[0],
    );
    const requestDates = alldates.map(
      (d: number) => new Date(d).toISOString().split("T")[0],
    );
    const isFound = roomDates.some((date: string) =>
      requestDates.includes(date),
    );
    return !isFound;
  };

  const handleSelectRoom = () => {
    if (!user) {
      openAuthModal("login");
      return;
    }

    if (!hasDates) {
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        const searchBar = document.getElementById("search-bar-container");
        if (searchBar) {
          searchBar.classList.add(
            "ring-4",
            "ring-red-500",
            "transition-all",
            "duration-300",
          );

          setTimeout(() => {
            searchBar.classList.remove("ring-4", "ring-red-500");
          }, 2000);
        }
      }, 500);
      return;
    }

    const availableRoom = room.roomNumbers.find((rn) => isAvailable(rn));

    if (availableRoom) {
      navigate("/booking", {
        state: {
          roomId: room._id,
          roomNumberId: availableRoom._id,
          price: room.price,
          title: room.title,
          hotelId: hotel._id,
          hotelRating: hotel.rating,
          hotelName: hotel.name,
          hotelAddress: hotel.address,
          photos: room.photos,
          cancellationPolicy: hotel.cancellationPolicy,
        },
      });
    } else {
      alert("Sorry, no rooms available for selected dates.");
    }
  };

  // --- Galery Modal Logic ---
  if (!room.photos || room.photos.length === 0) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPhotoIndex !== null) {
      setCurrentPhotoIndex((prev) => (prev! + 1) % room.photos.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPhotoIndex !== null) {
      setCurrentPhotoIndex(
        (prev) => (prev! - 1 + room.photos.length) % room.photos.length,
      );
    }
  };

  return (
    <>
      {/* --- Room Card --- */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Room Image */}
          <div className="md:w-72 h-56 md:h-auto flex-shrink-0">
            <button
              onClick={() => setCurrentPhotoIndex(0)}
              className="w-full h-full overflow-hidden rounded-lg group block"
            >
              <img
                src={room.photos[0]}
                alt={room.title}
                className="w-full h-full object-cover"
              />
            </button>
          </div>

          {/* Room Details */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex-1">
              {/* Room Title */}
              <h3 className="text-2xl text-gray-900 dark:text-white mb-4">
                {room.title}
              </h3>

              {/* Room Info */}
              <div className="flex flex-wrap gap-4 mb-5">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <BedDouble className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm">{room.bedType}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm">Up to {room.maxPeople} guests</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Maximize2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm">{room.size} sq ft</span>
                </div>
              </div>

              {/* Facilities */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-500 dark:text-gray-300 mb-3">
                  Facilities
                </h4>
                <div className="flex flex-wrap gap-3">
                  {room.roomFacilities.map((facility) => (
                    <div
                      key={facility}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-white bg-gray-50  dark:bg-[#3c59c0] px-3 py-2 rounded-lg"
                    >
                      {getIcon(facility)}
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price and CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                  Price per night
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  ${room.price}
                </div>
              </div>

              <button
                onClick={handleSelectRoom}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-auto rounded-lg"
              >
                {!hasDates ? "Check Availability" : "Select Room"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Lightbox Modal --- */}
      {currentPhotoIndex !== null &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setCurrentPhotoIndex(null)}
          >
            <button
              onClick={() => setCurrentPhotoIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50"
            >
              <X className="w-10 h-10" />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/70 hover:bg-black/80 hover:text-white transition-all z-50"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <img
              src={room.photos[currentPhotoIndex]}
              alt={`Gallery view ${currentPhotoIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/70 hover:bg-black/80 hover:text-white transition-all z-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-6 text-white/80 text-sm">
              {currentPhotoIndex + 1} / {room.photos.length}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
