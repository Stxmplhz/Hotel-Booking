import { useState } from "react";
import axios from "axios";

const AddHotel = () => {
    const [info, setInfo] = useState({
        name: "",
        type: "",
        city: "",
        address: "",
        distance: "",
        photos: [],
        description: "",
        rating: 5,
        amenities: [],
        cheapestPrice: 0,
        featured: ""
    })

    const [files, setFiles] = useState("");

    const uploadImage = async () => {
        try {
            const list = await Promise.all(
                object.value(files).map(async (file) => {
                    const data = new FormData();
                    data.append("file", file);
                    data.append("upload_preset", "hotel_booking");

                    const uploadRes = await axios.post(
                        "https://api.cloudinary.com/v1_1/dwho7vbl5/image/upload",
                        data
                    );

                    return uploadRes.data.secure_url;
                })
            );
            return list;
        } catch (err) {
            console.log(err);
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const list_url = await uploadImage();

            const newHotel = {
                ...info,
                photos: list_url,
            };

            await axios.post("http://localhost:8800/api/hotels", newHotel, {
                withCredentials: true
            });

            alert("Created new hotel successfully!");
        } catch (err) {
            console.log(err);
        }
    };

    return (
    <div className="p-10">
      <h1>Add New Hotel</h1>
      <form>
        <div className="formInput">
          <label>Images: </label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>

        <input 
            type="text" 
            placeholder="Hotel Name" 
            id="name" 
            onChange={(e) => setInfo({...info, name: e.target.value})} 
        />

        <input
            type="text"
            placeholder="City"
            id="city"
            onChange={(e) => setInfo({...info, city: e.target.value})}
        />

        <input
            type="text"
            placeholder="Address"
            id="address"
            onChange={(e) => setInfo({...info, address: e.target.value})}
        />

        <input
            type="text"
            placeholder="City"
            id="city"
            onChange={(e) => setInfo({...info, city: e.target.value})}
        />

        <input
            type="text"
            placeholder="Distance e.g., 500m from center"
            id="distance"
            onChange={(e) => setInfo({...info, address: e.target.value})}
        />

        <input
            type="text"
            placeholder="Description"
            id="description"
            onChange={(e) => setInfo({...info, address: e.target.value})}
        />

        <button 
            onClick={handleClick}
            className="bg-blue-500 text-white p-2 rounded mt-5"
        >
            Create
        </button>
      </form>
    </div>
  );
};

export default AddHotel;
