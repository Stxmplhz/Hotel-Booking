import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Lock, AlertCircle, Info } from "lucide-react";

interface CheckoutFormProps {
  total: number;
  handleBookingSubmit: (transactionId: string) => Promise<boolean>;
}

export const CheckoutForm = ({
  total,
  handleBookingSubmit,
}: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setMessage("");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/mybookings`,
        },
        redirect: "if_required",
      });

      if (error) {
        setMessage(error.message || "Payment failed.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment Success! ID:", paymentIntent.id);

        const bookingSuccess = await handleBookingSubmit(paymentIntent.id);

        if (bookingSuccess) {
          window.location.href = "/mybookings";
        } else {
          setMessage(
            "Payment successful but booking failed. Please contact support with Ref: " +
              paymentIntent.id,
          );
          setIsProcessing(false);
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {/* --- Demo Banner Section --- */}
      <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-4 rounded-r-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-amber-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400">
              Demo Mode Enabled
            </h3>
            <div className="mt-1 text-sm text-amber-700 dark:text-amber-500">
              <p>
                This is a test system; no actual charges will be applied to your
                card.
              </p>
              <div className="mt-2 flex items-center gap-2 font-mono bg-amber-100/50 dark:bg-amber-900/40 p-1 px-2 rounded w-fit border border-amber-200 dark:border-amber-800">
                <span>Test Card:</span>
                <span className="font-bold text-amber-900 dark:text-amber-200 tracking-wider">
                  4242 4242 4242 4242
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Stripe Payment Element --- */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <PaymentElement />
      </div>

      {/* --- Submit Button --- */}
      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        className={`w-full h-14 text-lg rounded-xl shadow-lg transition-all text-white flex items-center justify-center mt-6 font-semibold
            ${isProcessing ? "bg-gray-400 cursor-not-allowed scale-100" : "bg-[#3c59c0] hover:bg-[#3249a0] hover:shadow-xl active:scale-[0.98]"}
        `}
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <>
            <Lock className="w-5 h-5 mr-2" />
            Pay ${total.toLocaleString()} Now
          </>
        )}
      </button>

      {/* --- Error Message --- */}
      {message && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center justify-center gap-2 border border-red-100 dark:border-red-800">
          <AlertCircle className="w-4 h-4" />
          {message}
        </div>
      )}

      <p className="text-center text-xs text-gray-500 mt-4">
        Your payment is secured with 256-bit SSL encryption.
      </p>
    </form>
  );
};
