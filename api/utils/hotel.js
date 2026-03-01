export const updateHotelCheapestPrice = async (hotelId) => {
    const hotel = await Hotel.findById(hotelId);
    const rooms = await Promise.all(
        hotel.rooms.map((room) => Room.findById(room))
    );

    if (rooms.length > 0) {
        const prices = rooms.map(r => r.price);
        const minPrice = Math.min(...prices);

        await Hotel.findByIdAndUpdate(hotelId, { cheapestPrice: minPrice });
    }
};