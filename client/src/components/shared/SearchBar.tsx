import { useState, useContext, useEffect } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";

interface SearchBarProps {
  variant?: "home" | "hotels";
}

export function SearchBar({ variant = "home" }: SearchBarProps) {
  const { city, dates, options, dispatch } = useContext(SearchContext);

  const today = new Date().toISOString().split("T")[0];

  const formatInputDate = (date: any) => {
    if (!date) return "";

    const d = new Date(date);

    if (isNaN(d.getTime())) {
      return "";
    }

    return d.toISOString().split("T")[0];
  };

  const [destination, setDestination] = useState(city || "");
  const [checkIn, setCheckIn] = useState(formatInputDate(dates[0]?.startDate));
  const [checkOut, setCheckOut] = useState(formatInputDate(dates[0]?.endDate));
  const [guests, setGuests] = useState(options.adult || 1);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setDestination(city || "");
    setCheckIn(formatInputDate(dates[0]?.startDate));
    setCheckOut(formatInputDate(dates[0]?.endDate));
    setGuests(options.adult || 1);
  }, [city, dates, options]);

  const handleSearch = () => {
    let dateRange: { startDate: Date; endDate: Date }[] = [];
    let datesToSend: string[] = [];

    if (checkIn && checkOut) {
      dateRange = [
        {
          startDate: new Date(checkIn),
          endDate: new Date(checkOut),
        },
      ];
      datesToSend = [
        formatInputDate(new Date(checkIn)),
        formatInputDate(new Date(checkOut)),
      ];
    }

    dispatch({
      type: "NEW_SEARCH",
      payload: {
        city: destination,
        dates: dateRange,
        options: { adult: guests, children: 0, room: 1 },
      },
    });

    const isHotelDetailPage =
      location.pathname.includes("/hotels/") &&
      location.pathname.split("/").length > 2;

    if (!isHotelDetailPage) {
      navigate("/hotels", {
        state: {
          destination,
          dates: datesToSend,
          options: { adult: guests },
        },
      });
    }
  };

  const inputClassName =
    "w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400";

  const SearchButton = () => (
    <button
      onClick={handleSearch}
      className={`w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors
            ${variant === "home" ? "mt-6 py-4" : "h-full py-3"} 
            `}
    >
      <Search className="w-5 h-5" />
      <span className={variant === "home" ? "text-lg" : "hidden xl:inline"}>
        Search
      </span>
    </button>
  );

  return (
    <div
      id="search-bar-container"
      className={`text-gray-900 transition-all duration-300 z-40
            ${
              variant === "home"
                ? "bg-white rounded-2xl shadow-2xl p-6"
                : "w-full bg-[#142976] p-4 rounded-none sticky top-0"
            } 
        `}
    >
      <div
        className={`grid gap-4 ${
          variant === "home"
            ? "grid-cols-1 md:grid-cols-4"
            : "max-w-7xl mx-auto grid-cols-1 md:grid-cols-5 items-end"
        }`}
      >
        {/* --- Input 1: Destination --- */}
        <div className="relative">
          {variant === "home" && (
            <label className="block text-sm text-gray-600 mb-2">
              Destination
            </label>
          )}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={inputClassName}
              placeholder="Where are you going?"
            />
          </div>
        </div>

        {/* --- Input 2: Check-in --- */}
        <div className="relative">
          {variant === "home" && (
            <label className="block text-sm text-gray-600 mb-2">Check-in</label>
          )}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
              className={inputClassName}
              style={{ colorScheme: "light" }}
            />
          </div>
        </div>

        {/* --- Input 3: Check-out --- */}
        <div className="relative">
          {variant === "home" && (
            <label className="block text-sm text-gray-600 mb-2">
              Check-out
            </label>
          )}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
              className={inputClassName}
              style={{ colorScheme: "light" }}
            />
          </div>
        </div>

        {/* --- Input 4: Guests --- */}
        <div className="relative">
          {variant === "home" && (
            <label className="block text-sm text-gray-600 mb-2">Guests</label>
          )}
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              min="1"
              max="20"
              className={inputClassName}
            />
          </div>
        </div>

        {variant === "hotels" && (
          <div className="relative">
            <SearchButton />
          </div>
        )}
      </div>

      {variant === "home" && <SearchButton />}
    </div>
  );
}
