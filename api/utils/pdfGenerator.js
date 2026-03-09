import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Import แบบฟังก์ชัน

export const generateInvoiceBuffer = (booking, hotel) => {
  const doc = new jsPDF();

  const displayHotelName = hotel.name || "Hotel";
  const displayAddress = hotel.address || "";
  const checkInTime = hotel.checkInTime || "14:00";
  const checkOutTime = hotel.checkOutTime || "12:00";

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;

  const {
    basePrice = 0,
    taxes = 0,
    discount = 0,
    totalPrice = 0,
  } = booking.priceDetails || {};

  const pricePerNight =
    calculatedNights > 0 ? Math.round(basePrice / calculatedNights) : basePrice;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("INVOICE", 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Invoice #: INV-${booking._id.toString().substring(0, 8).toUpperCase()}`,
    14,
    28,
  );
  doc.text(`Date: ${new Date().toLocaleDateString("en-US")}`, 14, 33);

  // ข้อมูลโรงแรมชิดขวา
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text(displayHotelName, 196, 20, { align: "right" });
  doc.setFontSize(9);
  doc.setTextColor(100);
  const addressLines = doc.splitTextToSize(displayAddress, 60);
  doc.text(addressLines, 196, 26, { align: "right" });

  doc.line(14, 42, 196, 42);

  // ข้อมูลลูกค้า
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 14, 52);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `${booking.guestDetails.firstName} ${booking.guestDetails.lastName}`,
    14,
    58,
  );
  doc.text(booking.guestDetails.email, 14, 63);

  // ตารางราคา (ใช้ฟังก์ชัน autoTable แทน doc.autoTable)
  const tableBody = [
    [
      `${booking.rooms[0]?.roomType || "Room"} (${calculatedNights} Nights)`,
      `$${pricePerNight.toLocaleString()}`,
      `$${basePrice.toLocaleString()}`,
    ],
    ["Taxes & Fees", "-", `$${taxes.toLocaleString()}`],
  ];
  if (discount > 0)
    tableBody.push(["Discount", "-", `-$${discount.toLocaleString()}`]);

  autoTable(doc, {
    startY: 78,
    head: [["Description", "Rate", "Amount"]],
    body: tableBody,
    theme: "striped",
    headStyles: { fillColor: [20, 41, 118], halign: "center" },
  });

  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Total Paid: $${totalPrice.toLocaleString()}`, 196, finalY, {
    align: "right",
  });

  return Buffer.from(doc.output("arraybuffer"));
};
