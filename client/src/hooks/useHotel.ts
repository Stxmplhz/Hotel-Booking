import { useQuery } from "@tanstack/react-query";
import { getHotel } from "../services/api";
import type { Hotel } from "../types";

export const useHotel = (id: string | undefined) => {
  const { 
    data: hotel, 
    isLoading: loading, 
    error
  } =  useQuery<Hotel>({
    queryKey: ["hotel", id],
    queryFn: () => getHotel(id!),
    enabled: !!id,
  });

  return { 
    hotel, 
    loading, 
    error: error ? (error as any).message : null 
  };
};
