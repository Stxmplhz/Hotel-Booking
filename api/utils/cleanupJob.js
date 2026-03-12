import cron from "node-cron";
import Booking from "../models/Booking.js";

export const startCleanUpJob = () => {
    // Every 15  minutes
    cron.schedule("*/15 * * * *", async () => {
        console.log("[Cron Job] Scanning for expired pending bookings...")

        try {
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

            const result = await Booking.deleteMany({
            status: "pending",
            createdAt: { $lt: thirtyMinutesAgo }, 
        });

        if (result.deletedCount > 0) {
            console.log(`[Cron Job] Successfully deleted ${result.deletedCount} expired pending booking(s).`);
        }
        } catch (error) {
            console.error("[Cron Job] Cleanup error:", error.message);
        }
    });
};