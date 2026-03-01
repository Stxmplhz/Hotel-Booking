import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:8800/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Session Expired! Redirecting to Login...");
      alert("Session expired. Please login again.");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  },
);

export const getFeaturedHotels = async () => {
  const res = await api.get("/hotels?featured=true&limit=4");
  return res.data;
};

export const getHotels = async (queryParams?: any) => {
  const res = await api.get("/hotels", { params: queryParams });
  return res.data;
};

export const getHotel = async (hotelId: string) => {
  const res = await api.get(`/hotels/${hotelId}`);
  return res.data;
};

export const getHotelRooms = async (hotelId: string) => {
  const res = await api.get(`/hotels/room/${hotelId}`);
  return res.data;
};

export const createBooking = async (bookingData: any) => {
  const res = await api.post("/bookings", bookingData);
  return res.data;
};

export const createPayment = async (amount: any) => {
  const res = await api.post("/payment/create-payment-intent", amount);
  return res.data;
};

export const getUserBookings = async (userId: string) => {
  const res = await api.get(`/bookings/user/${userId}`);
  return res.data;
};

export default api;
