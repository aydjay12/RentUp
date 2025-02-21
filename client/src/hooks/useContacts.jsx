import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { useAuthStore } from "../store/useAuthStore";
import { useContactStore } from "../store/useContactStore";

const useContacts = () => {
  const { token, user } = useAuthStore(); // ✅ Get user & token from Zustand
  const { contacts, fetchAllContacts } = useContactStore(); // ✅ Use Zustand for contacts
  const queryRef = useRef();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allContacts", user?.email],
    queryFn: () => fetchAllContacts(token), // ✅ Call Zustand store function
    enabled: !!user?.email && !!token,
    staleTime: 30000,
    onSuccess: (data) => {
      // ✅ Ensure contacts state updates in Zustand
      useContactStore.getState().setContacts(data);
    },
  });

  queryRef.current = refetch;

  useEffect(() => {
    if (queryRef.current) {
      queryRef.current(); // ✅ Refetch when token changes
    }
  }, [token]);

  return { data: contacts, isError, isLoading, refetch };
};

export default useContacts;
