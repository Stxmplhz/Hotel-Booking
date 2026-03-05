import {
  Check,
  Clock,
  Star,
  StarHalf,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { formatTime } from "../../utils/time";
import type { Room } from "../../types";

interface BookingSummaryProps {
  roomData: Room & {
    hotelName?: string;
    roomType?: string;
    cancellationPolicy?: {
      type: "free" | "non-refundable" | "partial";
      deadlineHours: number;
    };
  };
  dates: {
    startDate: Date;
    endDate: Date;
  }[];
  options: {
    adult: number;
    children: number;
    room: number;
  };
  priceDetails: {
    originalPrice: number;
    nights: number;
    discount: number;
    taxesAndFees: number;
    total: number;
    originalSubtotal: number;
  };
  timeLeft: number;
  rating: number;
}

export const BookingSummary = ({
  roomData,
  dates,
  options,
  priceDetails,
  timeLeft,
  rating,
}: BookingSummaryProps) => {
  const realSubtotal =
    priceDetails.total + priceDetails.discount - priceDetails.taxesAndFees;
  return (
    <div className="lg:col-span-1">
      <div className="lg:sticky lg:top-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          {/* Red Alert Timer Bar */}
          <div className="bg-red-600 text-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm">We're holding your price</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono tabular-nums">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-2xl text-gray-900 dark:text-white mb-6">
              Booking Summary
            </h2>

            {/* Room Image */}
            <div className="rounded-lg overflow-hidden mb-4">
              <img
                src={roomData.photos ? roomData.photos[0] : ""}
                className="w-full h-40 object-cover"
              />
            </div>

            {/* Hotel Details with Rating */}
            <div className="mb-6">
              <h3 className="text-lg text-gray-900 dark:text-white mb-1">
                {roomData.hotelName || "Hotel Name"}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{roomData.roomType}</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;
                  if (rating >= starValue) {
                    return (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    );
                  } else if (rating >= starValue - 0.5) {
                    return (
                      <StarHalf
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    );
                  } else {
                    return; /*<Star key={i} className="w-5 h-5 text-gray-300" />;*/
                  }
                })}
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                  {rating}
                </span>
              </div>
            </div>

            {/* Dates & Guests */}
            <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Check-in
                </span>
                <span className="text-gray-900 dark:text-gray-300">
                  {dates[0]?.startDate?.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Check-out
                </span>
                <span className="text-gray-900 dark:text-gray-300">
                  {dates[0]?.endDate?.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Guests</span>
                <span className="text-gray-900 dark:text-gray-300">
                  {options.adult} Adults
                </span>
                <span className="text-gray-900 dark:text-gray-300">
                  {options.children} Children
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  ${priceDetails.originalPrice} × {priceDetails.nights} nights
                </span>
                <span className="text-gray-500 dark:text-gray-400 line-through">
                  ${priceDetails.originalPrice * priceDetails.nights}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600 dark:text-green-300">
                  Discount
                </span>
                <span className="text-green-600 dark:text-green-300">
                  -${priceDetails.discount * priceDetails.nights}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="text-gray-900 dark:text-gray-300">
                  ${realSubtotal}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Taxes & Fees
                </span>
                <span className="text-gray-900 dark:text-gray-300">
                  ${priceDetails.taxesAndFees}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6 border-t border-gray-200 pt-4">
              <span className="text-xl text-gray-900 dark:text-white">
                Total
              </span>
              <span className="text-3xl font-medium text-blue-700 dark:text-blue-400">
                ${priceDetails.total}
              </span>
            </div>

            {/* Cancellation Policy */}
            <div className="mt-4">
              {roomData.cancellationPolicy?.type === "non-refundable" ? (
                /* 1. แบบไม่คืนเงิน (สีแดง) */
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 dark:bg-red-900/20 dark:border-red-800">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-900 dark:text-red-400">
                      Non-Refundable
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      This booking cannot be canceled for a refund.
                    </p>
                  </div>
                </div>
              ) : roomData.cancellationPolicy?.type === "partial" ? (
                /* 2. แบบคืนเงินบางส่วน (สีส้ม/เหลือง) - เพิ่มตรงนี้ */
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 dark:bg-amber-900/20 dark:border-amber-800">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-400">
                      Partial Refund
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Cancel {roomData.cancellationPolicy.deadlineHours}h before
                      check-in for a partial refund.
                    </p>
                  </div>
                </div>
              ) : (
                /* 3. แบบยกเลิกฟรี (สีเขียว) */
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2 dark:bg-green-900/20 dark:border-green-800">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-green-900 dark:text-green-400">
                      Free Cancellation
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Until {roomData.cancellationPolicy?.deadlineHours || 24}h
                      before check-in
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
