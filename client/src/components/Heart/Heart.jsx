import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { useAuthStore } from "../../store/authStore";
import useSnackbarStore from "../../store/useSnackbarStore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

    const nextState = !isFavorited;
    setIsAnimating(true);

    try {
      await toFav(id);
      // Let animation play out
      setTimeout(() => setIsAnimating(false), 800);
    } catch (error) {
      showSnackbar("Failed to update favorite", "error");
      setIsAnimating(false);
    }
  };

  const heartVariants = {
    initial: { scale: 1 },
    liked: {
      scale: [1, 1.4, 1.2],
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    unliked: {
      scale: [1, 0.7, 1],
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      className="heart-icon-container"
      onClick={handleLike}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence>
        {isAnimating && isFavorited && (
          <motion.div
            className="heart-splash"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={isAnimating ? (isFavorited ? "liked" : "unliked") : "initial"}
        variants={heartVariants}
      >
        <AiFillHeart
          className={`heart-icon ${isFavorited ? 'favorited' : ''}`}
          size={24}
          color={isFavorited ? "#ff4757" : "rgba(0,0,0,0.4)"}
        />
      </motion.div>

      {/* Particle effect for like animation */}
      {isAnimating && isFavorited && (
        <div className="heart-particles">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="particle-v2"
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos(i * 45 * (Math.PI / 180)) * 35,
                y: Math.sin(i * 45 * (Math.PI / 180)) * 35,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </div>
      )}

      <span
        className="heart-tooltip"
      >
        {isFavorited ? "Remove from Favourites" : "Add to Favourites"}
      </span>
    </motion.div>
  );
};

export default Heart;