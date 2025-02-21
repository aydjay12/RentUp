import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Heart = ({ id }) => {
  const { user, isAuthenticated, toFav, favourites } = useAuthStore();
  const [heartColor, setHeartColor] = useState("gray");
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.favResidenciesID?.includes(id)) {
      setHeartColor("red");
    } else {
      setHeartColor("gray");
    }
  }, [user, id]); // ✅ Ensured `user` is checked before accessing properties

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("You must be logged in to like this", { position: "bottom-right", autoClose: 3000 });
      return;
    }
    if (!user?.isVerified) {
      toast.error("You must be verified to like this", { position: "bottom-right", autoClose: 3000 });
      return navigate("/otp-verification");
    }

    try {
      await toFav(id);
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  return (
    <AiFillHeart
      size={24}
      color={heartColor}
      cursor="pointer"
      onClick={handleLike}
    />
  );
};

export default Heart;
