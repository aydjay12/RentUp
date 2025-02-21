import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { useAuthStore } from "../store/authStore"; // Ensure correct import path

const useFavourites = () => {
  const { user, getAllFav } = useAuthStore();
  const queryRef = useRef();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allFavourites", user?.email],
    queryFn: () => getAllFav(),
    enabled: !!user, // Ensure user exists before making the request
    staleTime: 30000,
  });

  queryRef.current = refetch;

  useEffect(() => {
    if (queryRef.current) {
      queryRef.current();
    }
  }, [user]);

  return { data, isError, isLoading, refetch };
};

export default useFavourites;
