import { useState } from 'react';
import { useBookings } from '../../hooks/useBookings';
import { CheckCircle, XCircle, Clock, AlertCircle, ListFilter } from 'lucide-react';
import type { Booking } from '../../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { BookingCard } from './BookingCard';
import { BookingDetailModal } from './BookingDetailModal';
import { StatusModal } from '../ui/StatusModal';

export function BookingHistory() {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const [sortBy, setSortBy] = useState<'soonest' | 'latest_booked'>('soonest');

    const { loading, error, categories, handleCancel } = useBookings();
    const [statusConfig, setStatusConfig] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        message: string;
    }>({ isOpen: false, type: 'success', message: '' });

    const closeStatusModal = () => setStatusConfig(prev => ({ ...prev, isOpen: false }));

    const onCancelClick = async (id: string) => {
        const result = await handleCancel(id);
        if (result?.success) {
            setStatusConfig({
                isOpen: true,
                type: 'success',
                message: "Your booking has been cancelled successfully."
            });
            setSelectedBooking(null);
        } else {
            setStatusConfig({
                isOpen: true,
                type: 'error',
                message: result?.message || "Oops! Something went wrong."
            });
        }
    };

    const getSortedBookings = (list: Booking[]) => {
        return [...list].sort((a, b) => {
            if (sortBy === 'soonest') {
                return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
            } else if (sortBy === 'latest_booked') {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.checkIn).getTime();
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.checkIn).getTime();
                return dateB - dateA;
            }
            return 0;
        });
    };

    const renderBookingList = (
        list: Booking[], 
        emptyTitle: string, 
        emptyDesc: string, 
        Icon: any,
        showBrowseBtn: boolean = false
    ) => {
        const sortedList = getSortedBookings(list);

        if (sortedList.length > 0) {
            return (
                <div className="space-y-6">
                    {sortedList.map((booking) => (
                        <div 
                            key={booking._id} 
                            onClick={() => setSelectedBooking(booking)}
                            className="cursor-pointer transition-transform hover:scale-[1.01]"
                        >
                            <BookingCard booking={booking} />
                        </div>
                    ))}
                </div>
            );
        }
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center border border-gray-200 dark:border-gray-700">
                <Icon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-xl text-gray-900 dark:text-gray-100 mb-2">{emptyTitle}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{emptyDesc}</p>
                {showBrowseBtn && (
                    <button className="w-full h-14 text-lg rounded-xl shadow-lg transition-all text-white flex items-center justify-center mt-6 bg-[#3c59c0] hover:bg-[#3c59c0] hover:shadow-xl">
                        Browse Hotels
                    </button>
                )}
            </div>
        );
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error.message}</div>;
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <h1 className="text-4xl text-gray-900 dark:text-gray-100">My Trips</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and view all your bookings</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                        <TabsList className="w-full md:w-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1">
                            <TabsTrigger value="upcoming" className="flex-1 md:flex-none data-[state=active]:bg-[#6167c4] data-[state=active]:text-white dark:data-[state=active]:bg-[#6167c4] dark:text-gray-300">
                                <Clock className="w-4 h-4 mr-2" /> Upcoming ({categories.upcoming.length})
                            </TabsTrigger>
                            <TabsTrigger value="completed" className="flex-1 md:flex-none data-[state=active]:bg-[#6167c4] data-[state=active]:text-white dark:data-[state=active]:bg-[#6167c4] dark:text-gray-300">
                                <CheckCircle className="w-4 h-4 mr-2" /> Completed ({categories.completed.length})
                            </TabsTrigger>
                            <TabsTrigger value="canceled" className="flex-1 md:flex-none data-[state=active]:bg-[#6167c4] data-[state=active]:text-white dark:data-[state=active]:bg-[#6167c4] dark:text-gray-300">
                                <XCircle className="w-4 h-4 mr-2" /> Canceled ({categories.canceled.length})
                            </TabsTrigger>
                            <TabsTrigger value="pending" className="flex-1 md:flex-none data-[state=active]:bg-[#6167c4] data-[state=active]:text-white dark:data-[state=active]:bg-[#6167c4] dark:text-gray-300">
                                <AlertCircle className="w-4 h-4 mr-2" /> Pending ({categories.pending.length})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg shadow-sm">
                        <ListFilter className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sort by:</span>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-transparent text-sm font-semibold text-gray-900 dark:text-gray-100 outline-none cursor-pointer"
                        >
                            <option 
                                value="soonest" 
                                className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                            >
                                Check-in (Soonest)
                            </option>
                            <option 
                                value="latest_booked" 
                                className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                            >
                                Latest Booking
                            </option>
                        </select>
                    </div>
                </div>

                <Tabs value={activeTab} className="w-full">
                    <TabsContent value="upcoming">
                        {renderBookingList(categories.upcoming, "No upcoming trips", "Start planning your next adventure!", Clock, true)}
                    </TabsContent>

                    <TabsContent value="completed">
                        {renderBookingList(categories.completed, "No completed trips", "Your past bookings will appear here", CheckCircle)}
                    </TabsContent>

                    <TabsContent value="canceled">
                        {renderBookingList(categories.canceled, "No canceled trips", "Your canceled bookings will appear here", XCircle)}
                    </TabsContent>

                    <TabsContent value="pending">
                        {renderBookingList(categories.pending, "No pending trips", "Your pending bookings will appear here", AlertCircle)}
                    </TabsContent>
                </Tabs>
            </div>

            {selectedBooking && (
                <BookingDetailModal 
                    isOpen={!!selectedBooking}
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onCancel={onCancelClick}
                />
            )}

            <StatusModal 
                isOpen={statusConfig.isOpen}
                onClose={closeStatusModal}
                type={statusConfig.type}
                message={statusConfig.message}
            />
        </div>
    );
}