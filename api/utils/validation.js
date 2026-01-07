import { z } from "zod";

export const hotelSchema = z.object({
    name: z.string({ required_error: "Please enter hotel name" }).min(3, "The hotel name must be longer than 3 characters"),
    type: z.string({ required_error: "Please enter hotel type" }),
    city: z.string({ required_error: "Please enter city name" }),
    address: z.string({ required_error: "Please enter hotel address" }),
    distance: z.string().optional(),
    photos: z.array(z.string()).optional(), 
    description: z.string().optional(),
    amenities: z.array(z.string()).optional(), 
    cheapestPrice: z.number({ invalid_type_error: "The price must be number" }).min(100, "The lowest price is 100"),
    featured: z.boolean().optional(),
});

export const roomSchema = z.object({
    title: z.string({required_error: "Please enter room title"}),
    price: z.number({invalid_type_error: "he price must be number"}).min(100, "The lowest price is 100"),
    maxPeople: z.number({required_error: "Please enter max number of people for this room", invalid_type_error: "The max people must be number"}).min(1, "The lowest max people is 1"),
    quantity: z.number({invalid_type_error: "The max quantity must be number"}).min(1, "The lowest quantity is 1")
});

export const bookingSchema = z.object({
    checkIn: z.date({required_error: "Please enter check-in date"}),
    checkOut: z.date({required_error: "Please enter check-out date"})
});

export const registerSchema = z.object({
    username: z.string().min(3),
    email: z.email("Wrong email pattern"),
    password: z.string().min(6, "The password must be at least 6 characters long.")
});