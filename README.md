# 🏨 Hotel Booking System
A full-stack web application for searching and booking hotel rooms, built with a focus on core booking logic and backend automation.

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## Project Overview

This project is a functional **Hotel Booking System** that allows users to find accommodations and complete reservations. It handles the core logic of a booking platform, from searching availability to managing room inventory and payment states.

Currently, the system is fully functional for **Guest Users**. Admin and Partner features are planned for future development.

---

## Key Features

### 🔍 Search & Filters
* **Hotel Search:** Search for hotels by city, check-in/out dates, and guest count.
* **Room Availability:** Displays available rooms based on real-time data from the database.

### 🎫 Booking & Reservation
* **Room Locking:** Prevents other users from booking the same room while a transaction is in progress.
* **Booking Flow:** Step-by-step process from room selection to booking confirmation.
* **Payment Mockup:** A simulated payment process to update booking status.

### ⚙️ Backend & Automation
* **Auto-Cancellation:** A CronJob service that automatically cancels unpaid bookings and releases rooms back to inventory.
* **Data Management:** CRUD operations for hotels and room categories.

---

## Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React, TypeScript, Tailwind | User interface and client-side logic. |
| **Backend** | Node.js, JavaScript | API development and server-side logic. |
| **Database** | MongoDB | Data storage for hotels, rooms, and bookings. |
| **Task Runner** | Node-Cron | Handling scheduled tasks like auto-cancellation. |
| **Deployment** | Vercel, Render.com | Automated CI/CD pipeline for frontend hosting and cloud API services. |

---

## Project Roadmap

- [x] **Guest Booking Flow:** Search, Room Selection, and Mockup Payment.
- [x] **Room Inventory Logic:** Preventing double-booking and auto-cancel system.
- [ ] **Admin Dashboard:** Management interface for system administrators.
- [ ] **Hotel Owner Portal:** Interface for partners to manage their own properties.
