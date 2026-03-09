import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { sendEmail } from "./email.js";
import { generateInvoiceBuffer } from "./pdfGenerator.js";

export const fulfillOrder = async (bookingId, transactionId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking || booking.status === "confirmed") return;

  booking.status = "confirmed";
  booking.transactionId = transactionId;
  await booking.save();

  await Promise.all(
    booking.rooms.map((item) =>
      Room.updateOne(
        { "roomNumbers._id": item.roomNumberId },
        {
          $push: {
            "roomNumbers.$.unavailableDates": { $each: item.unavailableDates },
          },
        },
      ),
    ),
  );

  const hotel = await Hotel.findById(booking.hotelId);
  const pdfBuffer = generateInvoiceBuffer(booking, hotel);

  await sendEmail({
    to: booking.guestDetails.email,
    subject: `Confirmed: Your stay at ${hotel.name}`,
    html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #142976; color: white; padding: 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Booking Confirmed!</h1>
                <p style="margin: 8px 0 0; opacity: 0.8;">Reservation ID: #${booking._id.toString().substring(18).toUpperCase()}</p>
            </div>
            <div style="padding: 32px; color: #333;">
                <p style="font-size: 18px; margin-top: 0;">Hi <b>${booking.guestDetails.firstName}</b>,</p>
                <p>Your reservation at <b>${hotel.name}</b> is all set. We look forward to welcoming you!</p>
                
                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Stay Details</h3>
                <p style="margin: 10px 0;"><b>Check-in:</b> ${new Date(booking.checkIn).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric" })}</p>
                <p style="margin: 10px 0;"><b>Check-out:</b> ${new Date(booking.checkOut).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric" })}</p>
                <p style="margin: 10px 0;"><b>Room Type:</b> ${booking.rooms[0].roomType}</p>
                <p style="margin: 10px 0; font-size: 18px; color: #142976;"><b>Total Paid:</b> $${booking.priceDetails.totalPrice.toLocaleString()}</p>
                </div>

                <p style="font-size: 14px; color: #666;">Address: ${hotel.address}</p>
            </div>
            <div style="background-color: #f1f1f1; padding: 16px; text-align: center; font-size: 12px; color: #999;">
                &copy; 2026 Stayly Booking. All rights reserved.
            </div>
        </div>
    `,
    attachments: [
      {
        filename: `Invoice_${booking._id.toString().substring(18)}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  await sendEmail({
    to: hotel.email || process.env.ADMIN_EMAIL,
    subject: `Alert: New Booking Received - ${booking.guestDetails.firstName}`,
    html: `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>New Reservation Received</h2>
            <p>You have a new booking from <b>${booking.guestDetails.firstName} ${booking.guestDetails.lastName}</b>.</p>
            <ul>
                <li><b>Booking ID:</b> ${booking._id}</li>
                <li><b>Dates:</b> ${new Date(booking.checkIn).toDateString()} - ${new Date(booking.checkOut).toDateString()}</li>
                <li><b>Revenue:</b> $${booking.priceDetails.totalPrice}</li>
            </ul>
            <p>Please prepare the room accordingly.</p>
            </div>
        `,
  });
};
