# Hotel Booking API Documentation

Base URL: `http://localhost:8800/api`

## Authentication

### 1. Register
* **URL:** `/auth/register`
* **Method:** `POST`
* **Body:**
  ```json
  {
    "username": "john",
    "email": "john@gmail.com",
    "password": "123",
    "country": "Thailand",
    "img": "https://..."
  }
    
### 2. Login
* **URL:** `/auth/login`
* **Method:** `POST`
* **Body:**
  ```json
  {
    "username": "john",
    "password": "123"
  }
* **Response:** Receive access_token in Cookie and User info in JSON.

## Hotels

### 1. Search Hotels
* **URL:** `/hotels`
* **Method:** `GET`
* **Query Params:**
    - **City:** City name (e.g., Phuket)
    - **Min:** Minimum price (e.g., 1000)
    - **Max:** Maximum price
    - **MinPeople:** Minimum number of people (e.g., 2)
    - **CheckIn:** Check-in date (YYYY-MM-DD)
    - **CheckOut:** Check-out date (YYYY-MM-DD)
* **Example:** /hotels?city=Phuket&minPeople=2&checkIn=2024-12-25&checkOut=2024-12-27

### 2. Get Hotel Details & Rooms
* **URL:** /hotels/room/:hotelId
* **Method:** GET
* **Response:** Returns list of rooms inside that hotel.

## Booking

### 1. Create Booking
* **URL:** `/bookings`
* **Method:** `POST`
* **Headers:** Authorization: Bearer <token> (or Cookie)
* **Body:**
  ```json
  {
    "userId": "64f8...",
    "hotelId": "64f9...",
    "rooms": [
        {
            "roomNumberId": "64fa...", 
            "unavailableDates": ["2024-12-25", "2024-12-26", "2024-12-27"]
        }
    ],
    "checkIn": "2024-12-25",
    "checkOut": "2024-12-27",
    "totalPrice": 5000
    }

### 2. Confirm Payment
* **URL:** `/bookings/payment/:id`
* **Method:** `POST`
* **Headers:** Authorization: Bearer <token> (or Cookie)
* **Description:** Change booking status from pending to confirmed. Must be done within 20 mins.

### 3. Get User's Bookings History
* **URL:** `/bookings/payment/:id`
* **Method:** `GET`
* **Description:** Get all bookings of a specific user.