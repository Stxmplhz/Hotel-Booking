import cron from "node-cron"
import Booking from "../models/Booking.js"
import Room from "../models/Room.js"
import twentyMinutes from "../utils/time.js"

const cleanUpExpiredBookings = () => {
    cron.schedule("* * * * *", async () => {
        console.log("Running Cron Job: Checking for expired booking...");

        try {
            const twentyMinutesAgo = new Date(Date.now() - twentyMinutes);

            const expiredBookings = await Booking.find({
                status: "pending",
                createdAt: { $lt: twentyMinutesAgo },
            });

            if (expiredBookings.length > 0) {
                console.log(`Found ${expiredBookings.length} expired bookings.`);

                for (const booking of expiredBookings) {
                    await Promise.all(
                        booking.rooms.map((item) => {
                            return Room.updateOne(
                                { "roomNumbers._id": item.roomNumberId },
                                { 
                                    $pull: {
                                    "roomNumbers.$.unavailableDates":{ $in: item.unavailableDates },
                                    }
                                },
                            );
                        })
                    );

                    booking.status = "expired";
                    await booking.save();
                }
                console.log("Expired booking processed")
            }
        } catch (err) {
            console.error("Cron Job Error: ", err);
        }
    });
}   

export default cleanUpExpiredBookings;