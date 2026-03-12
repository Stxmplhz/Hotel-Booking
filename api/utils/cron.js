import cron from "node-cron";
import Booking from "../models/Booking.js";

export const startCronJobs = () => {

    // Job 1: Clear Expired Pending Booking (Works every 15 minutes.)
    cron.schedule("*/15 * * * *", async () => {
        console.log("[Cron Job] Scanning for expired pending bookings...")

        try {
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

            const expiredBookings = await Booking.find({
                status: "pending",
                createdAt: { $lt: thirtyMinutesAgo }, 
            });

            if (expiredBookings.length > 0) {
                for (const booking of expiredBookings) {
                    await Promise.all(
                        booking.rooms.map((item) =>
                            Room.updateOne(
                                { "roomNumbers._id": item.roomNumberId },
                                {
                                    $pull: {
                                        "roomNumbers.$.unavailableDates": { $in: item.unavailableDates },
                                    },
                                }
                            )
                        )
                    );
                }

                const bookingIds = expiredBookings.map(b => b._id);
                await Booking.deleteMany({ _id: { $in: bookingIds } });

                console.log(`[Cron Job] Successfully unlocked rooms and deleted ${expiredBookings.length} expired booking(s).`);
            }
        } catch (error) {
            console.error("[Cron Job] Cleanup error:", error.message);
        }
    });

    // Job 2: Change Booking status Confirmed -> Completed when exceed Check-out (Works every day at 00:00.)
    cron.schedule("0 0 * * *", async () => {
        console.log("[Cron Job] Scanning for check-outs to mark as completed...");
        
        try {
            const today = new Date();
            
            const result = await Booking.updateMany(
                { 
                    status: "confirmed", 
                    checkOut: { $lt: today } 
                },
                { 
                    $set: { status: "completed" } 
                }
            );

            if (result.modifiedCount > 0) {
                console.log(`[Cron Job] Successfully marked ${result.modifiedCount} booking(s) as completed.`);
            }
        } catch (error) {
            console.error("[Cron Job] Completion error:", error.message);
        }
    });

};