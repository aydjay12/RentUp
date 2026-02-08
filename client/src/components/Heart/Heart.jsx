import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { useAuthStore } from "../../store/authStore";
import useSnackbarStore from "../../store/useSnackbarStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Heart.css";

const Heart = ({ id }) => {
  const { user, isAuthenticated, toFav, favourites } = useAuthStore();
  const [heartColor, setHeartColor] = useState("black");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { showSnackbar } = useSnackbarStore();
  const navigate = useNavigate();

  useEffect(() => {
    const favorited = user && user.favResidenciesID?.includes(id);
    setIsFavorited(favorited);
    setHeartColor(favorited ? "red" : "black");
  }, [user, id]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showSnackbar("You must be logged in to like this", "error");
      return;
    }
    if (!user?.isVerified) {
      showSnackbar("You must be verified to like this", "error");
      return navigate("/otp-verification");
    }

    // Trigger animation
    setIsAnimating(true);

    try {
      await toFav(id);
      // Reset animation state after completion
      setTimeout(() => setIsAnimating(false), 600);
    } catch (error) {
      showSnackbar("Failed to update favorite", "error");
      setIsAnimating(false);
    }
  };

  const heartVariants = {
    initial: {
      scale: 1,
      rotate: 0
    },
    liked: {
      scale: [1, 1.4, 1.1, 1.3, 1],
      rotate: [0, -10, 10, -5, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        times: [0, 0.3, 0.5, 0.8, 1]
      }
    },
    unliked: {
      scale: [1, 0.8, 1.1, 1],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        times: [0, 0.4, 0.7, 1]
      }
    }
  };

  const getAnimationState = () => {
    if (!isAnimating) return "initial";
    return isFavorited ? "unliked" : "liked";
  };

  return (
    <motion.div
      className="heart-icon-container"
      initial="initial"
      animate={getAnimationState()}
      variants={heartVariants}
      onClick={handleLike}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AiFillHeart
        className={`heart-icon ${isFavorited ? 'favorited' : ''}`}
        size={24}
        color={heartColor}
        cursor="pointer"
      />

      {/* Particle effect for like animation */}
      {isAnimating && !isFavorited && (
        <motion.div
          className="heart-particles"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.6 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{
                scale: 0,
                x: 0,
                y: 0,
                opacity: 1
              }}
              animate={{
                scale: [0, 1, 0],
                x: [0, (i % 2 ? 1 : -1) * (20 + i * 5)],
                y: [0, -20 - i * 3],
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.05,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      )}

      <span
        className="heart-tooltip"
        style={{ backgroundColor: heartColor }}
      >
        {isFavorited ? "Remove from Favourites" : "Add to Favourites"}
      </span>
    </motion.div>
  );
};

export default Heart;