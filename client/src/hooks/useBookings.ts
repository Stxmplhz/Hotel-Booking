import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import type { Booking } from '../types';

export const useBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const fetchBookings = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await axios.get(
                `http://localhost:8800/api/bookings/user/${user._id}`, 
                { withCredentials: true }
            );
            setBookings(res.data);
        } catch (err: any) {
            setError("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleCancel = async (bookingId: string) => {
        try {
            const res = await axios.put(
                `http://localhost:8800/api/bookings/cancel/${bookingId}`, 
                {}, 
                { withCredentials: true }
            );

            if (res.status === 200) {
                setBookings(prev => prev.map(b =>
                    b._id === bookingId ? { ...b, status: res.data.status } : b
                ));
                return { success: true };
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "Cancellation failed";
            return { 
                success: false, 
                message: msg 
            };
        }
    };
    const categories = {
        upcoming: bookings.filter(b => b.status === 'confirmed'),
        completed: bookings.filter(b => b.status === 'completed'),
        canceled: bookings.filter(b => b.status === 'canceled' || b.status === 'refunded'),
        pending: bookings.filter(b => b.status === 'pending'),
    };

    return { 
        bookings, 
        loading, 
        error, 
        categories, 
        handleCancel, 
        refresh: fetchBookings 
    };
};
