import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
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
    e.preventDefault(); // Prevent form refresh

    // Construct query parameters
    const queryParams = new URLSearchParams(filters).toString();
    navigate(`/search?${queryParams}`);
  };

  return (
    <section className="hero">
      <div className="container">
        <Heading title="Search Your Next Home" subtitle="Find new & featured property located in your local city." />

        <form className="flex" onSubmit={handleSearch}>
          <div className="box">
            <span>City/Street</span>
            <input type="text" name="location" placeholder="Location" value={filters.location} onChange={handleInputChange} />
          </div>
          <div className="box">
            <span>Property Type</span>
            <input type="text" name="propertyType" placeholder="Property Type" value={filters.propertyType} onChange={handleInputChange} />
          </div>
          <div className="box">
            <span>Price Range</span>
            <input type="number" name="priceRange" placeholder="Price Range" value={filters.priceRange} onChange={handleInputChange} />
          </div>
          <div className="box">
            <h4>Advance Filter</h4>
          </div>
          <button type="submit" className="btn1 search">
            <FaSearch />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
