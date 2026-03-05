// migrate-hotels.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB for migration...");

    // เข้าถึง collection โดยตรง (ไม่ผ่าน Model) เพื่อจัดการข้อมูลดิบ
    const collection = mongoose.connection.db.collection("hotels");

    // ดึงข้อมูลทั้งหมดมาเป็น Array
    const hotels = await collection.find({}).toArray();
    console.log(`Found ${hotels.length} hotels to check.`);

    for (let hotel of hotels) {
      // เช็คว่าถ้ายังเป็น String หรือเป็นข้อมูลเก่า
      if (typeof hotel.cancellationPolicy === "string") {
        const isNonRefundable = hotel.cancellationPolicy === "Non-refundable";

        const newPolicy = {
          type: isNonRefundable ? "non-refundable" : "free",
          deadlineHours: isNonRefundable ? 0 : 24,
          refundPercentage: isNonRefundable ? 0 : 100,
          description: isNonRefundable
            ? "Non-refundable policy. No refund will be issued."
            : "Free cancellation 24h before check-in.",
        };

        await collection.updateOne(
          { _id: hotel._id },
          {
            $set: {
              cancellationPolicy: newPolicy,
              taxRate: 0.07,
              serviceCharge: 0.1,
              updatedAt: new Date(), // บังคับอัปเดตวันที่
            },
          },
        );
        console.log(`✅ Migrated: ${hotel.name}`);
      } else {
        console.log(`⏩ Skipped: ${hotel.name} (Already object)`);
      }
    }

    console.log("Migration completed successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

migrate();
