import { useState, useEffect } from "react";
import { getHotel } from "../services/api";
import type { Hotel } from "../types";

export const useHotel = (id: string | undefined) => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      try {
        if (id) {
            const data = await getHotel(id);
            setHotel(data); 
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load hotel data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchHotel();
    }
  }, [id]);

  return { hotel, loading, error };
};