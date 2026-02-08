import React from "react";
import { motion } from "framer-motion";

const Back = ({ name, title, cover }) => {
  return (
    <div className="back">
      <div className="back-image-wrapper">
        <img src={cover} alt={title} />
        <div className="back-overlay"></div>
      </div>
      <div className="container">
        <motion.div
          className="back-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="back-name">{name}</span>
          <h1 className="back-title">{title}</h1>
        </motion.div>
      </div>
    </div>
  );
};

export default Back;
