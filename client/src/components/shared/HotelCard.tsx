import { Star, MapPin } from 'lucide-react';
import type { Hotel } from '../../types';
import { Link } from "react-router-dom";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
    return (
        <div className="
            bg-white dark:bg-gray-800 
            rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent dark:border-gray-700
        ">
            <Link 
              to={`/hotels/${hotel._id}`} 
            >
            {/* Hotel Image */}
            <div className="relative h-56 overflow-hidden">
                <img
                src={hotel.photos[0] || "https://via.placeholder.com/300"}
                alt={hotel.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
            </div>

            {/* Hotel Info */}
            <div className="p-5">
                <h3 className="text-xl mb-2 text-gray-900 dark:text-white truncate"> 
                    {hotel.name}
                </h3>
                
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-3"> 
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{hotel.city}</span>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-900 dark:text-gray-100 font-medium">{hotel.rating}</span> 
                    </div>

                    <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Starting from
                        </div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ${hotel.cheapestPrice}
                        </div>
                    </div>
                </div>  
            </div>
            </Link>
        </div>
    );
}
