import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Heart.css";

const Heart = ({ id }) => {
  const { user, isAuthenticated, toFav, favourites } = useAuthStore();
  const [heartColor, setHeartColor] = useState("black");
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const favorited = user && user.favResidenciesID?.includes(id);
    setIsFavorited(favorited);
    setHeartColor(favorited ? "red" : "black");
  }, [user, id]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("You must be logged in to like this", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    if (!user?.isVerified) {
      toast.error("You must be verified to like this", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return navigate("/otp-verification");
    }

    try {
      await toFav(id);
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  const heartVariants = {
    initial: { scale: 1 },
    clicked: {
      scale: [1, 1.3, 0.9, 1.2, 1],
      transition: { duration: 0.5, ease: "easeInOut", times: [0, 0.2, 0.3, 0.4, 1] },
    },
  };

  return (
    <motion.div
      className="heart-icon-container"
      initial="initial"
      animate="initial"
      whileTap="clicked"
      variants={heartVariants}
      onClick={handleLike}
    >
      <AiFillHeart
        className="heart-icon"
        size={24}
        color={heartColor}
        cursor="pointer"
      />
      <span
        className="heart-tooltip"
        style={{ backgroundColor: heartColor }} // Dynamic background color
      >
        {isFavorited ? "Remove from Favourites" : "Add to Favourites"}
      </span>
    </motion.div>
  );
};

export default Heart;