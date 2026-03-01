import type { Booking, BookingStatus, Hotel } from '../../types';
import { Calendar, MapPin, CheckCircle, XCircle, ChevronRight, User } from 'lucide-react';
import { Badge } from '../ui/ฺBadge';
import { formatDateRange } from '../../utils/time';

const getStatusConfig = (status: BookingStatus) => {
  switch (status) {
    case 'confirmed':
      return {
        label: 'Confirmed',
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        icon: CheckCircle,
      };
    case 'completed':
      return {
        label: 'Completed',
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        icon: CheckCircle,
      };
    case 'canceled':
      return {
        label: 'Canceled',
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        icon: XCircle,
      };
    case 'pending':
      return {
        label: 'Pending',
        className: 'bg-red-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        icon: XCircle,
      };
    case 'refunded':
      return {
        label: 'Refunded',
        className: 'bg-green-100 text-green-600 dark:bg-green-700 dark:text-green-300',
        icon: CheckCircle,
      };
  }
};

export const BookingCard = ({ booking }: { booking: Booking }) => {
  const hotel = (typeof booking.hotelId === 'object' ? booking.hotelId : {}) as Hotel;
  const roomType = booking.rooms[0]?.roomType || "Standard Room";

  const hotelName = hotel.name || "Unknown Hotel";
  const hotelImage = hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : "https://placehold.co/600x400?text=No+Image";
  const hotelLocation = hotel.city || hotel.address || "Unknown Location";
  
  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left - Image */}
        <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
          <img
            src={hotelImage}
            alt={hotelName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Middle - Details */}
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full justify-between">
            <div>
              <h3 className="text-xl text-gray-900 dark:text-gray-100 mb-2">
                {hotelName}
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{hotelLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateRange(booking.checkIn, booking.checkOut)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{roomType}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-500">
                Booking Ref: {booking._id.substring(0, 8).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Right - Price, Status, Action */}
        <div className="p-6 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 md:w-64">
          <div className="w-full space-y-4">
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Price</div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">
                ${booking.priceDetails.totalPrice}
              </div>   
            </div>

            <div className="flex justify-end">
              <Badge className={`${statusConfig.className} flex items-center gap-1.5 px-3 py-1.5`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig.label}
              </Badge>
            </div>
          </div>

          <button
            className="w-full h-14 text-lg rounded-xl shadow-lg transition-all text-white flex items-center justify-center mt-6 bg-[#6167c4] hover:bg-[#4e54a8] dark:bg-[#6167c4] dark:hover:bg-[#4e54a8]"
          >
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};