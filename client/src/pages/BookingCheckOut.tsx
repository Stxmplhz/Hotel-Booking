import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutStepper } from '../components/checkout/CheckoutStepper';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { GuestDetailsForm } from '../components/checkout/GuestDetailsForm';
import { BookingSummary } from '../components/checkout/BookingSummary';
import DisclaimerText from '../components/checkout/DisclaimerText';
import { useBookingCheckout } from '../hooks/useBookingCheckout';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function BookingCheckout() {
  const { 
    roomData, dates, options, priceDetails, timeLeft, 
    clientSecret, formData, handleInputChange, onBookingSubmit 
  } = useBookingCheckout();  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white border-b border-gray-200 shadow-sm dark:bg-[#142976] dark:border-gray-700">
        <CheckoutStepper />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms (65% width) */}
          <div className="lg:col-span-2 space-y-6">
            <GuestDetailsForm 
                formData={formData} 
                onChange={handleInputChange} 
            />

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-2xl text-gray-900 dark:text-white mb-2">Payment Details</h2>
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                    <CheckoutForm 
                        total={priceDetails.total} 
                        handleBookingSubmit={onBookingSubmit} 
                    />
                </Elements>
              ) : (
                <div className="flex justify-center p-10">
                    <span className="text-gray-500">Loading payment secure server...</span>
                </div>
              )}
            </div>

            <DisclaimerText />

          </div>

          {/* Right Column - Booking Summary (35% width) */}
          <div className="lg:col-span-1">
             <BookingSummary 
               roomData={roomData}
               dates={dates}
               options={options}
               priceDetails={priceDetails}
               timeLeft={timeLeft}
               rating={roomData.hotelRating || 0}
             />
          </div>
          
        </div>
      </div>
    </div>
  );
}
