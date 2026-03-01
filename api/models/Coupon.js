import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
    code: {
        type: String, 
        required: true, 
        unique: true,
        uppercase: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'], 
        required: true
    },
    value: { 
        type: Number, 
        required: true 
    },
    maxDiscount: { 
        type: Number 
    }, 
    expirationDate: { 
        type: Date, 
        required: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    applicableHotels: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Hotel' 
    }]
}, { timestamps: true }); 

export default mongoose.model("Coupon", CouponSchema);