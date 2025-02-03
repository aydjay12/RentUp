import React from "react";
import { HiLocationMarker } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Heart from "../../Heart/Heart";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const RecentCard = ({ card }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="box shadow"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
    >
      <motion.div
        className="img"
        onClick={() => navigate(`../properties/${card.id}`)}
        whileHover={{ scale: 1.02 }}
      >
        <img src={card.image} alt={card.title} />
      </motion.div>

      <div className="text">
        <div className="category flex">
          <motion.span
            style={{
              background: card.status === "For Sale" ? "#25b5791a" : "#ff98001a",
              color: card.status === "For Sale" ? "#25b579" : "#ff9800",
            }}
            whileHover={{ scale: 1.02 }}
          >
            {card.status}
          </motion.span>
          <motion.div whileTap={{ scale: 0.8 }}>
            <Heart id={card?.id} />
          </motion.div>
        </div>
        <h4>{card.title}</h4>
        <p>
          <HiLocationMarker /> {card.address}, <span>{card.city}</span>
        </p>
      </div>

      <div className="flex padd">
        <motion.div whileHover={{ scale: 1 }}>
          <button className="btn2 price-btn">${card.price}</button> <span>/sqft</span>
        </motion.div>
        <span>{card.type}</span>
      </div>
    </motion.div>
  );
};

export default RecentCard;
