import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import "./Heart.css";

const Heart = ({ id }) => {
  const { user, isAuthenticated, toFav, favourites } = useAuthStore();
  const [heartColor, setHeartColor] = useState("gray");
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const favorited = user && user.favResidenciesID?.includes(id);
    setIsFavorited(favorited);
    setHeartColor(favorited ? "red" : "gray");
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

  // Define the animation variants for the heart icon
  const heartVariants = {
    initial: { scale: 1 },
    clicked: {
      scale: [1, 1.2, 0.9, 1.1, 1], // Heartbeat pulse effect
      transition: { duration: 0.5, ease: "easeInOut", times: [0, 0.4, 0.5, 0.6, 1] },
    },
  };

  return (
    <motion.div
      className="heart-icon-container"
      initial="initial"
      animate="initial"
      whileHover={{ scale: 1.1 }} // Slight scale on hover
      whileTap="clicked" // Trigger animation on click
      variants={heartVariants}
      onClick={handleLike}
    >
      <AiFillHeart
        className="heart-icon"
        size={24}
        color={heartColor}
        cursor="pointer"
      />
      <span className="heart-tooltip">
        {isFavorited ? "Remove from Favourites" : "Add to Favourites"}
      </span>
    </motion.div>
  );
};

export default Heart;