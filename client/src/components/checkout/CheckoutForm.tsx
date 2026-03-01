import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Lock } from 'lucide-react';

interface CheckoutFormProps {
  total: number;
  handleBookingSubmit: (transactionId: string) => Promise<boolean>;
}

export const CheckoutForm = ({ total, handleBookingSubmit }: CheckoutFormProps) => {
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
                setMessage("Payment successful but booking failed. Please contact support with Ref: " + paymentIntent.id);
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
      <PaymentElement />
      <button 
        disabled={isProcessing || !stripe || !elements} 
        id="submit"
        className={`w-full h-14 text-lg rounded-xl shadow-lg transition-all text-white flex items-center justify-center mt-6
            ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3c59c0] hover:bg-[#3c59c0] hover:shadow-xl'}
        `}
      >
        {isProcessing ? (
          <span>Processing Payment...</span>
        ) : (
          <>
            <Lock className='w-5 h-5 mr-2' />
            Confirm & Pay ${total}
          </>
        )}
      </button>
      {message && <div className="text-red-500 mt-2 text-center">{message}</div>}
    </form>
  );
};