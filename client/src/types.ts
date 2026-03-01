export interface User {
  _id: string;    
  username: string;
  email: string;
  password?: string;
  img?: string;
  role: 'user' | 'admin' | 'hotel';
  createdAt?: string;
  updatedAt?: string;
}

export interface Hotel {
  _id: string;    
  name: string;
  type: string;
  city: string;
  address: string;
  distance: string;
  photos: string[];  
  description: string;
  rating: number;
  rooms: string[];
  amenities: string[];
  cheapestPrice: number;
  featured: boolean;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  taxRate?: number;      
  serviceCharge?: number; 
}

export interface Room {
  _id: string;
  hotelId: string;
  title: string;
  price: number;
  maxPeople: number;
  description: string;
  roomNumbers: { 
      number: number; 
      unavailableDates: string[];
      _id: string;
  }[];
  photos: string[];
  bedType: string;
  size: number;
  roomFacilities: string[];
  view: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'canceled'  | 'refunded';

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface GuestCount {
  adults: number;
  children: number;
}

export interface PriceDetails {
  basePrice: number;
  taxes: number;
  discount: number;
  totalPrice: number;
  nights: number;
  originalPrice: number;
}

export interface HotelSnapshot {
  name: string;
  address: string;
  image: string;
}

export interface Booking {
  _id: string;
  userId: string;
  hotelId: Hotel | string; 
  hotelDetails?: HotelSnapshot; 
  rooms: {
    roomNumberId: string;
    roomType?: string;  
    unavailableDates: string[]; 
  }[];
  guestDetails: GuestDetails;
  guestCount: GuestCount;
  checkIn: string; 
  checkOut: string; 
  priceDetails: PriceDetails;
  status: BookingStatus;
  cancellationPolicySnapshot?: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt?: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  maxDiscount?: number;
  expirationDate: string;
  isActive: boolean;
}