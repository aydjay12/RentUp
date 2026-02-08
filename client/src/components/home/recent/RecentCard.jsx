import React from "react";
import { HiLocationMarker } from "react-icons/hi";
import { MdMeetingRoom, MdShower, MdDirectionsCar } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Heart from "../../Heart/Heart";
import Cart from "../../Cart/Cart";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const RecentCard = ({ card }) => {
  const navigate = useNavigate();

  if (!card) return null;

  return (
    <motion.div
      className="property-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -10 }}
    >
      <div className="card-image-wrapper">
        <img
          src={card.image}
          alt={card.title}
          onClick={() => navigate(`/properties/${card._id}`)}
        />
        <div className="card-status-tag" style={{
          background: card.status === "For Sale" ? "rgba(39, 174, 96, 0.9)" : "rgba(242, 153, 74, 0.9)"
        }}>
          {card.status || "For Sale"}
        </div>
        <div className="card-actions">
          <Heart id={card._id} />
          <Cart id={card._id} />
        </div>
      </div>

      <div className="card-content">
        <div className="card-price-row">
          <span className="card-price">${card.price?.toLocaleString()}</span>
          <span className="card-type">{card.type}</span>
        </div>

        <h3 className="card-title" onClick={() => navigate(`/properties/${card._id}`)}>
          {card.title}
        </h3>

        <p className="card-location">
          <HiLocationMarker /> {card.address}, {card.city}
        </p>

        <div className="card-facilities">
          <div className="facility-item">
            <MdMeetingRoom size={18} />
            <span>{card.facilities?.bedrooms || 0} Beds</span>
          </div>
          <div className="facility-item">
            <MdShower size={18} />
            <span>{card.facilities?.bathrooms || 0} Baths</span>
          </div>
          <div className="facility-item">
            <MdDirectionsCar size={18} />
            <span>{card.facilities?.parkings || 0} Parking</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentCard;