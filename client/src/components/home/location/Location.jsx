import React from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../../common/Heading";
import { location } from "../../data/Data";
import { motion } from "framer-motion";
import "./style.css";

const Location = () => {
  const navigate = useNavigate();

  const handleBoxClick = (city, country) => {
    navigate(`/search?location=${city}&country=${country}`);
  };

  return (
    <section className="location padding">
      <div className="container">
        <Heading title="Explore By Location" subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam." />
        <motion.div 
          className="content grid3 mtop"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {location.map((item, index) => (
            <motion.div
              key={index}
              className="box"
              onClick={() => handleBoxClick(item.city, item.country)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={item.cover} alt="" />
              <div className="overlay">
                <h5>{item.city}, <span>{item.country}</span></h5>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Location;
