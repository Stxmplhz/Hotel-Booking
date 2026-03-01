import { useState } from 'react';
import { X, MapPin, Share2, Download, XCircle, Calendar, User, AlertTriangle, Navigation, ChevronUp, ChevronDown } from 'lucide-react';
import { formatDate } from '../../utils/time';
import type { Booking, Hotel } from '../../types';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import Modal from './../ui/Modal';

interface BookingDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking;
    onCancel: (id: string) => void;
}

export const BookingDetailModal = ({ isOpen, onClose, booking, onCancel }: BookingDetailModalProps) => {
  const [isPriceExpanded, setIsPriceExpanded] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen) return null;

  // Hotel Details
  const hotelData = booking.hotelId as Hotel; 
  const hotelSnapshot = booking.hotelDetails;
  const displayHotelName = hotelSnapshot?.name || hotelData.name;
  const displayAddress = hotelSnapshot?.address || hotelData.address;
  const displayImage = hotelSnapshot?.image || hotelData.photos?.[0] || "";
  const checkInTime = hotelData.checkInTime || "14:00";
  const checkOutTime = hotelData.checkOutTime || "12:00";

  // Date Details
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;

  // Price Details
  const { 
    basePrice = booking.priceDetails.basePrice, 
    taxes = booking.priceDetails.taxes, 
    discount = booking.priceDetails.discount, 
    totalPrice = booking.priceDetails.totalPrice
  } = booking.priceDetails || {};
  const pricePerNight = calculatedNights > 0 ? Math.round(basePrice / calculatedNights) : basePrice;

  const handleDownloadInvoice = () => {
    generateInvoicePDF(booking); 
  };

  // Cancellation Policy Logic
  const policy = hotelData.cancellationPolicy as any; 
  const isNonRefundable = policy?.type === 'non-refundable';
  const policyDescription = policy?.description || `Cancel ${policy?.deadlineHours || 24} hours before check-in for refund.`;
  const canCancel = (booking.status === 'confirmed' || booking.status === 'pending') && !isNonRefundable;

  return (  
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        
        {/* --- Modal Container --- */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative flex flex-col">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* --- Header Image --- */}
          <div className="relative h-64 shrink-0">
            <img 
              src={displayImage}
              alt={displayHotelName}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Hotel Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-3xl font-bold mb-2 leading-tight">
                {displayHotelName || "Unknown Hotel"}
              </h2>
              <div className="flex items-center gap-2 text-sm md:text-base text-gray-200">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate">{displayAddress}</span>
              </div>
            </div>
          </div>

          {/* --- Body Content --- */}
          <div className="p-6 space-y-6">
            
            {/* Key Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <InfoBox 
                icon={Calendar} 
                label="Check-in" 
                value={formatDate(checkInDate)} 
                subValue={checkInTime}
              />
              <InfoBox 
                icon={Calendar} 
                label="Check-out" 
                value={formatDate(checkOutDate)} 
                subValue={checkOutTime}
              />
              <InfoBox 
                icon={User} 
                label="Guests" 
                value={
                  <>
                    {booking.guestCount.adults} Adult(s)
                    <br />
                    {booking.guestCount.children} Children
                  </>
                }
                className="col-span-2 md:col-span-1"
              />
            </div>

            {/* Room Details */}
            <div className="flex flex-col md:flex-row gap-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Room</p>
                  <p className="text-lg font-mono font-bold text-gray-800 dark:text-gray-100 tracking-wide">
                      {booking.rooms?.[0]?.roomType}
                  </p>
              </div>
              <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Special Request</p>
                  <p className="text-lg font-mono font-bold text-gray-800 dark:text-gray-100 tracking-wide">
                    {booking.guestDetails.specialRequests}
                  </p>
              </div>
            </div>

            {/* Reference & Status */}
            <div className="flex flex-col md:flex-row gap-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Booking Reference</p>
                  <p className="text-lg font-mono font-bold text-gray-800 dark:text-gray-100 tracking-wide">
                      {booking._id.substring(0, 8).toUpperCase()}
                  </p>
              </div>
              <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'canceled' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {booking.status}
                  </span>
              </div>
            </div>

            {/* Cancellation Policy */}
            {booking.status !== 'canceled' && (
              <div className={`rounded-xl p-4 border flex gap-3 ${
                  !isNonRefundable
                  ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800' 
                  : 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800'
              }`}>
                  <AlertTriangle className={`w-5 h-5 shrink-0 ${!isNonRefundable ? 'text-yellow-600' : 'text-red-600'}`} />
                  <div>
                      <h4 className={`text-sm font-semibold ${!isNonRefundable ? 'text-yellow-800 dark:text-yellow-500' : 'text-red-800 dark:text-red-400'}`}>
                          {!isNonRefundable ? 'Cancellation Policy' : 'Non-Refundable'}
                      </h4>
                      <p className={`text-xs mt-1 ${!isNonRefundable ? 'text-yellow-700 dark:text-yellow-400' : 'text-red-700 dark:text-red-300'}`}>
                          {policyDescription}
                      </p>
                  </div>
              </div>
            )}

            {/* Contact Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={async () => {
                  const shareData = {
                    title: `Booking at ${displayHotelName}`,
                    text: `I'm staying at ${displayHotelName} from ${formatDate(checkInDate)} to ${formatDate(checkOutDate)}.\nAddress: ${displayAddress}`,
                    url: window.location.href 
                  };

                  try {
                    if (navigator.share) {
                      await navigator.share(shareData);
                    } else {
                      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
                      alert("Booking info copied!");
                    }
                  } catch (err) {
                    console.log("Error sharing", err);
                  }
                }}
                className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium dark:text-gray-200"
              >
                <Share2 className="w-4 h-4 text-[#6167c4]" />
                Share Booking
              </button>

              <button 
                onClick={() => {
                  if (displayAddress) {
                    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`;
                    window.open(mapUrl, '_blank');
                  } else {
                    alert("Address not available.");
                  }
                }}
                className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium dark:text-gray-200"
              >
                <Navigation className="w-4 h-4 text-[#6167c4]" />
                Get Directions
              </button>
            </div>

            {/* 6. Price Breakdown */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
              <button 
                  onClick={() => setIsPriceExpanded(!isPriceExpanded)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Price Breakdown</span>
                  <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${totalPrice}</span>
                      {isPriceExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
              </button>
              
              {isPriceExpanded && (
                  <div className="p-4 bg-white dark:bg-gray-800 space-y-3 text-sm">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>${pricePerNight} × {calculatedNights} nights</span>
                          <span>${basePrice}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Discount</span>
                          <span>-${discount}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Taxes & Fees (Est.)</span>
                          <span>${taxes}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <span>Total Paid</span>
                          <span className="text-[#6167c4]">${totalPrice}</span>
                      </div>
                  </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <button 
                onClick={handleDownloadInvoice} 
                className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-[#6167c4] text-[#6167c4] rounded-xl font-semibold hover:bg-[#6167c4] hover:text-white transition-all"
              >
                <Download className="w-5 h-5" />
                Download Invoice
              </button>

              {canCancel && (
                <button 
                  onClick={() => setShowCancelConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition-all"
                  >
                    <XCircle className="w-5 h-5" />
                    Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={showCancelConfirm} 
        onClose={() => setShowCancelConfirm(false)}
        title="Confirm Cancellation"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to cancel your booking at <strong>{displayHotelName}</strong>? 
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => setShowCancelConfirm(false)}
              className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Keep Booking
            </button>
            <button 
              onClick={() => {
                onCancel(booking._id);
                setShowCancelConfirm(false);
                onClose(); 
              }}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

const InfoBox = ({ icon: Icon, label, value, subValue, className = "" }: any) => (
  <div className={`bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700 ${className}`}>
    <div className="flex gap-3">
       <div className="mt-2.5 flex items-center justify-center w-fit h-fit p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Icon className="w-5 h-5 text-[#6167c4]" />
       </div>
       <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">{value}</p>
          {subValue && <p className="text-xs text-gray-400 mt-0.5">{subValue}</p>}
       </div>
    </div>
  </div>
);

