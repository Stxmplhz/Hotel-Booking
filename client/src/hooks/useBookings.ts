import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import type { Booking } from "../types";

export const useBookings = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const {
    data: bookings = [],
    isLoading: loading,
    error,
  } = useQuery<Booking[]>({
    queryKey: ["bookings", user?._id],
    queryFn: async () => {
      const res = await api.get(`/bookings/user/${user?._id}`);
      return res.data;
    },
    enabled: !!user,
  });

  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await api.put(`/bookings/cancel/${bookingId}`);
      return res.data;
    },
    onMutate: async (bookingId) => {
      await queryClient.cancelQueries({ queryKey: ["bookings", user?._id] });
      const previousBookings = queryClient.getQueryData<Booking[]>(["bookings", user?._id]);
      queryClient.setQueryData<Booking[]>(["bookings", user?._id], (old) =>
        old?.map((b) => (b._id === bookingId ? { ...b, status: "canceled" } : b))
      );

      return { previousBookings };
    },
    onError: (_err, _bookingId, context) => {
      queryClient.setQueryData(["bookings", user?._id], context?.previousBookings);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", user?._id] });
    },  
  })

  const handleCancel = async (bookingId: string) => {
    if (!user) return { 
      success: false, 
      message: "Please login first" 
    };
    try {
      await cancelMutation.mutateAsync(bookingId);
      return { 
        success: true 
      };
    } catch (err: any) {
      return { 
        success: false, 
        message: err.response?.data?.message || "Cancellation failed" 
      };
    }
  }

  const categories = {
    upcoming: bookings.filter((b) => b.status === "confirmed"),
    completed: bookings.filter((b) => b.status === "completed"),
    canceled: bookings.filter(
      (b) => b.status === "canceled" || b.status === "refunded",
    ),
    pending: bookings.filter((b) => b.status === "pending"),
  };

  return {
    bookings,
    loading,
    error,
    categories,
    handleCancel,
    refresh: () => queryClient.invalidateQueries({ queryKey: ["bookings", user?._id] }),
  };
};
