import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "./time";
import type { Booking, Hotel } from "../types";

export const generateInvoicePDF = (booking: Booking) => {
  const doc = new jsPDF();

  // --- Data Preparation ---
  const hotelData = booking.hotelId as Hotel;
  const hotelSnapshot = booking.hotelDetails;
  const displayHotelName = hotelSnapshot?.name || hotelData.name;
  const displayAddress = hotelSnapshot?.address || hotelData.address;
  const checkInTime = hotelData.checkInTime || "14:00";
  const checkOutTime = hotelData.checkOutTime || "12:00";

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;

  const {
    basePrice = booking.priceDetails.basePrice,
    taxes = booking.priceDetails.taxes,
    discount = booking.priceDetails.discount,
    totalPrice = booking.priceDetails.totalPrice,
  } = booking.priceDetails || {};
  const pricePerNight =
    calculatedNights > 0 ? Math.round(basePrice / calculatedNights) : basePrice;

  // --- PDF Styles ---
  const primaryColor = "#000000";
  const grayColor = "#6b7280";
  const tableColor = "#292929";

  // --- Header ---
  doc.setFontSize(22);
  doc.setTextColor(primaryColor);
  doc.text("INVOICE", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(grayColor);
  doc.text(
    `Invoice #: INV-${booking._id.substring(0, 8).toUpperCase()}`,
    14,
    28,
  );
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 33);

  // --- Hotel Info (Right Aligned) ---
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const hotelNameWidth = doc.getTextWidth(displayHotelName);
  doc.text(displayHotelName, 200 - hotelNameWidth, 20);

  doc.setFontSize(9);
  doc.setTextColor(grayColor);
  const addressLines = doc.splitTextToSize(displayAddress, 60);
  doc.text(addressLines, 200 - doc.getTextWidth(addressLines[0]), 26);

  // --- Line Break ---
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 40, 196, 40);

  // --- Guest & Booking Info ---
  doc.setFontSize(11);
  doc.setTextColor(primaryColor);
  doc.text("Bill To:", 14, 50);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(
    `${booking.guestDetails.firstName} ${booking.guestDetails.lastName}`,
    14,
    56,
  );
  doc.text(booking.guestDetails.email, 14, 61);
  doc.text(booking.guestDetails.phone, 14, 66);

  doc.setFontSize(11);
  doc.setTextColor(primaryColor);
  doc.text("Booking Details:", 110, 50);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Check-in: ${formatDate(checkInDate)} (${checkInTime})`, 110, 56);
  doc.text(`Check-out: ${formatDate(checkOutDate)} (${checkOutTime})`, 110, 61);
  doc.text(
    `Guests: ${booking.guestCount.adults} Adults, ${booking.guestCount.children} Children`,
    110,
    66,
  );

  // --- Payment Summary Table Content ---
  const tableBody = [
    [
      `${booking.rooms[0]?.roomType || "Standard Room"} (${calculatedNights} Nights)`,
      `$${pricePerNight}`,
      `$${basePrice}`,
    ],
    [`Taxes & Fees`, `-`, `$${taxes}`],
  ];

  if (discount > 0) {
    tableBody.push([`Discount`, `-`, `-$${discount}`]);
  }

  autoTable(doc, {
    startY: 75,
    head: [["Description", "Rate", "Amount"]],
    body: tableBody,
    theme: "striped",
    headStyles: { fillColor: tableColor },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { halign: "right" },
      2: { halign: "right" },
    },
  });

  // --- Total Section ---
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Total:", 140, finalY);

  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.text(`$${totalPrice}`, 196, finalY, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(booking.status === "confirmed" ? "#16a34a" : "#dc2626");
  doc.text(`Status: ${booking.status.toUpperCase()}`, 14, finalY);

  doc.save(`Invoice_${booking._id}.pdf`);
};
