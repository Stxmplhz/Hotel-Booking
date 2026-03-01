import { useParams } from "react-router-dom"; 
import { HotelDetail } from "../components/hotels/HotelDetail"; 
import { SearchBar } from "../components/shared/SearchBar"; 
import { useHotel } from "../hooks/useHotel";

export function Hotel() {
  const { id } = useParams(); 
  const { hotel, loading, error } = useHotel(id);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error || !hotel) return <div className="text-center mt-20">Hotel not found</div>;

  return (
    <main>
       <SearchBar variant="hotels" />
       <HotelDetail hotel={hotel} />
    </main>
  );
}