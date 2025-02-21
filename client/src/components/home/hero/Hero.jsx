import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import Heading from "../../common/Heading";
import "./hero.css";
import { FaSearch } from "react-icons/fa";

const Hero = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(filters).toString();
    navigate(`/search?${queryParams}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, },
    tap: { scale: 0.9 },
  };

  return (
    <section className="hero">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Heading
            title="Search Your Next Home"
            subtitle="Find new & featured property located in your local city."
          />
        </motion.div>

        <motion.form
          className="flex"
          onSubmit={handleSearch}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="box" whileHover={{ y: -5 }}>
            <span>City/Street</span>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleInputChange}
            />
          </motion.div>
          <motion.div className="box" whileHover={{ y: -5 }}>
            <span>Property Type</span>
            <input
              type="text"
              name="propertyType"
              placeholder="Property Type"
              value={filters.propertyType}
              onChange={handleInputChange}
            />
          </motion.div>
          <motion.div className="box" whileHover={{ y: -5 }}>
            <span>Price Range</span>
            <input
              type="number"
              name="priceRange"
              placeholder="Price Range"
              value={filters.priceRange}
              onChange={handleInputChange}
            />
          </motion.div>
          <motion.div className="box" whileHover={{ y: 0 }}>
            <h4>Advance Filter</h4>
          </motion.div>
          <motion.button
            type="submit"
            className="btn1 search"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaSearch />
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default Hero;