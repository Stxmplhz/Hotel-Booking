import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String, // e.g., Hotel, Resort, Villa
    required: true,
  },
  city: { 
    type: String, 
    required: true,
    index: true
  },
  address: { 
    type: String, 
    required: true 
  },
  distance: { 
    type: String // e.g., "500m from center" 
  }, 
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  photos: { 
    type: [String] 
  },
  description: { 
    type: String 
  },
  rating: { 
    type: Number, 
    min: 0, 
    max: 5,
    default: 0,
    set: (v) => Math.round(v * 10) / 10
  },
  rooms: {
    type: [String], 
  },
  amenities: { 
    type: [String] // ['wifi', 'pool']
  }, 
  cheapestPrice: { 
    type: Number,
    index: true
  }, 
  featured: { 
    type: Boolean, 
    default: false 
  },
  checkInTime: {
      type: String, // e.g., "14:00"
      default: "14:00"
  },
  checkOutTime: {
      type: String, // e.g., "12:00"
      default: "12:00"
  },
  cancellationPolicy: {
      type: {
        type: String, 
        enum: ['free', 'non-refundable', 'partial'],
        default: 'free'
      },
      deadlineHours: { 
        type: Number, 
        default: 24 
      },
      refundPercentage: { 
        type: Number, 
        default: 100
      },
      description: { 
        type: String
      }
  },
  taxRate: { 
      type: Number, 
      required: true 
  },
  serviceCharge: { 
      type: Number, 
      required: true
  }
}, { timestamps: true });

export default mongoose.model("Hotel", HotelSchema);