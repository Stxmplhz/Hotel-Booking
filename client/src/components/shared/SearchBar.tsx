import { useState, useContext, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Plus,
  Minus,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";

interface SearchBarProps {
  variant?: "home" | "hotels";
}

export function SearchBar({ variant = "home" }: SearchBarProps) {
  const { city, dates, options, dispatch } = useContext(SearchContext);
  const [openOptions, setOpenOptions] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const formatInputDate = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  const [destination, setDestination] = useState(city || "");
  const [checkIn, setCheckIn] = useState(formatInputDate(dates[0]?.startDate));
  const [checkOut, setCheckOut] = useState(formatInputDate(dates[0]?.endDate));
  const [adults, setAdults] = useState(options.adult || 1);
  const [children, setChildren] = useState(options.children || 0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setDestination(city || "");
    setCheckIn(formatInputDate(dates[0]?.startDate));
    setCheckOut(formatInputDate(dates[0]?.endDate));
    setAdults(options.adult || 1);
    setChildren(options.children || 0);
  }, [city, dates, options]);

  const handleSearch = () => {
    let dateRange: { startDate: Date; endDate: Date }[] = [];
    if (checkIn && checkOut) {
      dateRange = [
        { startDate: new Date(checkIn), endDate: new Date(checkOut) },
      ];
    }

    dispatch({
      type: "NEW_SEARCH",
      payload: {
        city: destination,
        dates: dateRange,
        options: { adult: adults, children, room: 1 },
      },
    });

    if (!location.pathname.includes("/hotels/")) {
      navigate("/hotels", {
        state: {
          destination,
          dates: [checkIn, checkOut],
          options: { adult: adults, children },
        },
      });
    }
    setOpenOptions(false);
  };

  const inputWrapperClass = "relative w-full";
  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none";
  const inputFieldClass =
    "w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white";

  return (
    <div
      className={`text-gray-900 transition-all duration-300 z-40 ${variant === "home" ? "bg-white rounded-2xl shadow-2xl p-6" : "w-full bg-[#142976] p-4 sticky top-0"}`}
    >
      <div
        className={`grid gap-4 ${variant === "home" ? "grid-cols-1 md:grid-cols-4" : "max-w-7xl mx-auto grid-cols-1 md:grid-cols-5 items-end"}`}
      >
        {/* Destination */}
        <div className="flex flex-col">
          {variant === "home" && (
            <label className="block text-sm text-gray-600 mb-2 font-medium">
              Destination
            </label>
          )}
          <div className={inputWrapperClass}>
            <MapPin className={iconClass} />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={inputFieldClass}
              placeholder="Where are you going?"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="flex flex-col">
          {variant === "home" && (
            <label className="block text-sm text-gray-600 mb-2 font-medium">
              Check-in
            </label>
          )}
          <div className={inputWrapperClass}>
            <Calendar className={iconClass} />
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
              className={inputFieldClass}
              style={{ colorScheme: "light" }}
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="flex flex-col">
          {variant === "home" && (
            <label className="block text-sm text-gray-600 mb-2 font-medium">
              Check-out
            </label>
          )}
          <div className={inputWrapperClass}>
            <Calendar className={iconClass} />
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
              className={inputFieldClass}
              style={{ colorScheme: "light" }}
            />
          </div>
        </div>

        {/* Guests Dropdown */}
        <div className="flex flex-col">
          {variant === "home" && (
            <label className="block text-sm text-gray-600 mb-2 font-medium">
              Guests
            </label>
          )}
          <div className={inputWrapperClass}>
            <div
              onClick={() => setOpenOptions(!openOptions)}
              className={`${inputFieldClass} cursor-pointer flex items-center justify-between`}
            >
              <div className="flex items-center">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <span className="truncate">
                  {adults} Adults · {children} Children
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openOptions ? "rotate-180" : ""}`}
              />
            </div>

            {/* Popover Menu */}
            {openOptions && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in duration-150">
                {/* Adult Counter */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-gray-700">Adults</span>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={adults <= 1}
                      onClick={() => setAdults(adults - 1)}
                      className="p-1 rounded-full border border-blue-600 text-blue-600 disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-5 text-center font-bold">{adults}</span>
                    <button
                      onClick={() => setAdults(adults + 1)}
                      className="p-1 rounded-full border border-blue-600 text-blue-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Children Counter */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-700 block">
                      Children
                    </span>
                    <span className="text-[10px] text-gray-400">Ages 0-17</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={children <= 0}
                      onClick={() => setChildren(children - 1)}
                      className="p-1 rounded-full border border-blue-600 text-blue-600 disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-5 text-center font-bold">
                      {children}
                    </span>
                    <button
                      onClick={() => setChildren(children + 1)}
                      className="p-1 rounded-full border border-blue-600 text-blue-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {variant === "hotels" && (
          <div className="w-full">
            <SearchButton onClick={handleSearch} variant={variant} />
          </div>
        )}
      </div>
      {variant === "home" && (
        <SearchButton onClick={handleSearch} variant={variant} />
      )}
    </div>
  );
}

const SearchButton = ({ onClick, variant }: any) => (
  <button
    onClick={onClick}
    className={`w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95
      ${variant === "home" ? "mt-6 py-4 text-lg font-bold" : "h-[50px] py-3 font-semibold"} 
    `}
  >
    <Search className="w-5 h-5" />
    <span>Search</span>
  </button>
);
