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
    default: 0
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
}, { timestamps: true });

export default mongoose.model("Hotel", HotelSchema);