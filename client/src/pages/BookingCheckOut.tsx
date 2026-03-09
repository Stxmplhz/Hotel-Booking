import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutStepper } from "../components/checkout/CheckoutStepper";
import { CheckoutForm } from "../components/checkout/CheckoutForm";
import { GuestDetailsForm } from "../components/checkout/GuestDetailsForm";
import { BookingSummary } from "../components/checkout/BookingSummary";
import DisclaimerText from "../components/checkout/DisclaimerText";
import { useBookingCheckout } from "../hooks/useBookingCheckout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function BookingCheckout() {
  const {
    roomData,
    dates,
    options,
    priceDetails,
    timeLeft,
    clientSecret,
    isInitializing,
    formData,
    handleInputChange,
    handleProceedToPayment,
  } = useBookingCheckout();

  const isFormComplete =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "";

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

            {/* Payment Section */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-2xl text-gray-900 dark:text-white mb-2">
                Payment Details
              </h2>
              {clientSecret ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance: { theme: "stripe" } }}
                  >
                    <CheckoutForm total={priceDetails.total} />
                  </Elements>
                </div>
              ) : (
                <div className="mt-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Please confirm your guest details above to proceed with the
                    secure payment.
                  </p>
                  <button
                    onClick={handleProceedToPayment}
                    disabled={!isFormComplete || isInitializing}
                    className={`w-full h-14 text-lg rounded-xl shadow-lg transition-all text-white flex items-center justify-center font-semibold
                      ${!isFormComplete || isInitializing ? "bg-gray-400 cursor-not-allowed" : "bg-[#3c59c0] hover:bg-[#3249a0] active:scale-[0.98]"}
                    `}
                  >
                    {isInitializing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Initializing Secure Payment...</span>
                      </div>
                    ) : (
                      "Continue to Payment"
                    )}
                  </button>
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
