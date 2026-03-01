import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext";
import { createPayment, createBooking } from "../services/api";
import { dayDifference, getDatesInRange } from "../utils/time";

export const useBookingCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { dates, options } = useContext(SearchContext);

  const roomData = location.state || {};
  const nights =
    dates && dates[0] ? dayDifference(dates[0].endDate, dates[0].startDate) : 1;
  const roomPrice = roomData.price || 0;

  const subtotal = roomPrice * nights * options.room;
  const hotelTaxRate =
    (roomData.taxRate || 0.07) + (roomData.serviceCharge || 0.1);
  const taxesAndFees = Math.round(subtotal * hotelTaxRate);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const verifyCoupon = async () => {
    try {
      // const res = await axios.post("/api/coupons/verify", { code: couponCode, amount: subtotal });
      // setDiscount(res.data.discountAmount);

      // Mock Data ไปก่อนเพื่อทดสอบ UI
      if (couponCode === "PROMO500") {
        setDiscount(500);
        setIsCouponApplied(true);
        alert("Coupon Applied: 500 THB Off!");
      } else {
        throw new Error("Invalid Code");
      }
    } catch (err) {
      alert("Invalid Coupon");
      setDiscount(0);
    }
  };

  const total = subtotal + taxesAndFees - discount;
  const originalSubtotal = subtotal + taxesAndFees;

  // -- States --
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [clientSecret, setClientSecret] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    specialRequests: "",
  });

  // -- Payment Intent --
  useEffect(() => {
    if (total > 0) {
      createPayment({ amount: total })
        .then((res) => setClientSecret(res.clientSecret))
        .catch((err) => console.log("Payment Error:", err));
    }
  }, [total]);

  // -- Validation Redirect --
  useEffect(() => {
    if (!roomData?.hotelId) {
      alert("Session invalid.");
      navigate("/");
    }
  }, [roomData, navigate]);

  // -- Timer --
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Session Expired!");
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onBookingSubmit = async (transactionId: string): Promise<boolean> => {
    if (!user) {
      alert("Please login...");
      return false;
    }

    const requiredFields = ["firstName", "lastName", "email", "phone"];
    const isFormComplete = requiredFields.every(
      (field) => (formData as any)[field]?.trim() !== "",
    );

    if (!isFormComplete) {
      alert("Please fill in all required guest details.");
      return false;
    }

    try {
      const allDates = getDatesInRange(dates[0].startDate, dates[0].endDate);

      await createBooking({
        userId: user._id,
        hotelId: roomData.hotelId,
        rooms: [
          {
            roomNumberId: roomData.roomNumberId,
            roomType: roomData.title,
            unavailableDates: allDates,
          },
        ],
        checkIn: dates[0].startDate,
        checkOut: dates[0].endDate,
        priceDetails: {
          basePrice: subtotal,
          taxes: taxesAndFees,
          discount: discount,
          totalPrice: total,
        },
        couponCode: isCouponApplied ? couponCode : null,
        guestDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests,
        },
        guestCount: {
          adults: options.adult,
          children: options.children,
        },
        transactionId: transactionId,
        paymentMethod: "Card",
      });
      return true;
    } catch (err) {
      console.error("Booking Error:", err);
      alert("Booking creation failed.");
      return false;
    }
  };

  return {
    roomData,
    dates,
    options,
    priceDetails: {
      nights,
      discount,
      taxesAndFees,
      total,
      subtotal,
      originalSubtotal,
      originalPrice: roomPrice + discount,
    },
    couponProps: {
      couponCode,
      setCouponCode,
      verifyCoupon,
      isCouponApplied,
      discount,
    },
    timeLeft,
    clientSecret,
    formData,
    handleInputChange,
    onBookingSubmit,
  };
};
