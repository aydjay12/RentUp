import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { featured } from "../../data/Data";

const FeaturedCard = () => {
  const navigate = useNavigate();

  const handleClick = (type) => {
    navigate(`/search?propertyType=${encodeURIComponent(type)}`);
  };

  return (
    <motion.div
      className="content grid5 mtop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {featured.map((items, index) => (
        <motion.div
          className="box"
          key={index}
          onClick={() => handleClick(items.type)}
          style={{ cursor: "pointer" }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={items.cover} alt="" />
          <h4>{items.type}</h4>
          <label>{items.total}</label>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeaturedCard;
