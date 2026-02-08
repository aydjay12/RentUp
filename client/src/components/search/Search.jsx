import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Back from "../common/Back";
import RecentCard from "../home/recent/RecentCard";
import "../home/recent/recent.css";
import "./search.css";
import img from "../images/services.jpg";
import { PuffLoader } from "react-spinners";
import { Search as SearchIcon } from "lucide-react";
import { useResidencyStore } from "../../store/useResidencyStore";

const Search = () => {
  const { residencies, fetchAllResidencies, loading } = useResidencyStore();
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

  useEffect(() => {
    fetchAllResidencies();
  }, [fetchAllResidencies]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="wrapper flex-center"
        style={{ height: "85vh" }}
      >
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </motion.div>
    );
  }

  const filteredProperties = residencies
    .filter((property) =>
      filters.location
        ? property.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.address?.toLowerCase().includes(filters.location.toLowerCase())
        : true
    )
    .filter((property) =>
      filters.country
        ? property.country?.toLowerCase().includes(filters.country.toLowerCase())
        : true
    )
    .filter((property) =>
      filters.propertyType
        ? property.type?.toLowerCase().includes(filters.propertyType.toLowerCase())
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
      className="search-page"
    >
      <section className="search-hero">
        <Back name="Search Properties" title="Find Your Dream Property" cover={img} />
      </section>

      <div className="search-filter-section">
        <div className="container">
          <motion.form
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="search-filter-container shadow"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="box">
              <span>City/Street</span>
              <input type="text" name="location" placeholder="Where to?" value={filters.location} onChange={handleInputChange} />
            </div>
            <div className="box">
              <span>Country</span>
              <input type="text" name="country" placeholder="Any Country" value={filters.country} onChange={handleInputChange} />
            </div>
            <div className="box">
              <span>Property Type</span>
              <input type="text" name="propertyType" placeholder="Type" value={filters.propertyType} onChange={handleInputChange} />
            </div>
            <div className="box">
              <span>Max Price</span>
              <input type="number" name="priceRange" placeholder="No limit" value={filters.priceRange} onChange={handleInputChange} onWheel={(e) => e.target.blur()} />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="search-btn"
            >
              <SearchIcon size={24} />
            </motion.button>
          </motion.form>
        </div>
      </div>

      <section className="search-results section">
        <div className="container">
          <motion.div
            className="properties-grid"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              },
            }}
          >
            {filteredProperties.length > 0 ? (
              filteredProperties.map((card, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <RecentCard card={card} />
                </motion.div>
              ))
            ) : (
              <div className="no-results-box">
                <SearchIcon size={48} className="nothing-icon" />
                <p>No properties match your current filters. Try adjusting your criteria.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Search;
