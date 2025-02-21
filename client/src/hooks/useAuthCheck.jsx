import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";

const useAuthCheck = () => {
  const { isAuthenticated } = useAuthStore();
  const validateLogin = () => {
    if (!isAuthenticated) {
      toast.error("you must be logged in", { position: "bottom-right" });
      return false;
    } else return true;
  };
  return {
    validateLogin,
  };
};

export default useAuthCheck;
