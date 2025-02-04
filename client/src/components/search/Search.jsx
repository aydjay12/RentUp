import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Back from "../common/Back";
import RecentCard from "../home/recent/RecentCard";
import "../home/recent/recent.css";
import "../properties/properties.css";
import img from "../images/services.jpg";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const { data, isError, isLoading } = useProperties();
  const [searchParams] = useSearchParams();

  const initialFilters = {
    location: searchParams.get("location") || "",
    country: searchParams.get("country") || "",
    propertyType: searchParams.get("propertyType") || "",
    priceRange: searchParams.get("priceRange") || "",
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="wrapper"
      >
        <span>Error while fetching data</span>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="wrapper flexCenter"
        style={{ height: "60vh" }}
      >
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#27ae60"
          aria-label="puff-loading"
        />
      </motion.div>
    );
  }

  const filteredProperties = data
    .filter((property) =>
      filters.location
        ? property.city.toLowerCase().includes(filters.location.toLowerCase())
        : true
    )
    .filter((property) =>
      filters.country
        ? property.country.toLowerCase().includes(filters.country.toLowerCase())
        : true
    )
    .filter((property) =>
      filters.propertyType
        ? property.type
            .toLowerCase()
            .includes(filters.propertyType.toLowerCase())
        : true
    )
    .filter((property) => {
      if (!filters.priceRange) return true;
      const inputPrice = parseInt(filters.priceRange, 10);
      return property.price <= inputPrice;
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="blog-out mb">
        <Back
          name="Search Properties"
          title="Find Your Dream Property"
          cover={img}
        />
      </section>
      <div className="flexColCenter paddings properties-container">
        <motion.form
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex search-filter filter-container search-box"
        >
          <div className="box">
            <span>City/Street</span>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleInputChange}
            />
          </div>
          <div className="box">
            <span>Country</span>
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={filters.country}
              onChange={handleInputChange}
            />
          </div>
          <div className="box">
            <span>Property Type</span>
            <input
              type="text"
              name="propertyType"
              placeholder="Property Type"
              value={filters.propertyType}
              onChange={handleInputChange}
            />
          </div>
          <div className="box">
            <span>Price Range</span>
            <input
              type="number"
              name="priceRange"
              placeholder="Price Range"
              value={filters.priceRange}
              onChange={handleInputChange}
            />
          </div>
          <motion.div className="box" whileHover={{ y: -5 }}>
            <h4>Advance Filter</h4>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="btn1 search"
          >
            <FaSearch />
          </motion.button>
        </motion.form>
        <motion.div
          className="paddings flexCenter properties"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          {filteredProperties.length > 0 ? (
            filteredProperties.map((card, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <RecentCard card={card} />
              </motion.div>
            ))
          ) : (
            <p className="nothing">No properties match your criteria.</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Search;
