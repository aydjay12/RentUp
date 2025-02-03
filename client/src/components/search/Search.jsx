import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Import search params hook
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
  const [searchParams] = useSearchParams(); // Get search parameters

  // Extract query params
  const initialFilters = {
    location: searchParams.get("location") || "",
    country: searchParams.get("country") || "",
    propertyType: searchParams.get("propertyType") || "",
    priceRange: searchParams.get("priceRange") || "",
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    // Update filters when URL params change
    setFilters(initialFilters);
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while fetching data</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader height="80" width="80" radius={1} color="#27ae60" aria-label="puff-loading" />
      </div>
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
      filters.propertyType ? property.type.toLowerCase().includes(filters.propertyType.toLowerCase()) : true
    )
    .filter((property) => {
      if (!filters.priceRange) return true; // If no price range is set, include all properties
      const inputPrice = parseInt(filters.priceRange, 10); // Convert input to a number
      return property.price <= inputPrice; // Only include properties with price <= inputPrice
    });

  return (
    <div>
      <section className="blog-out mb">
        <Back name="Search Properties" title="Find Your Dream Property" cover={img} />
      </section>
      <div className="flexColCenter paddings properties-container">
        <form className="flex search-filter filter-container">
          <div className="box">
            <span>City/Street</span>
            <input type="text" name="location" placeholder="Location" value={filters.location} onChange={handleInputChange} />
          </div>
          <div className="box">
            <span>Country</span>
            <input type="text" name="country" placeholder="Country" value={filters.country} onChange={handleInputChange} />
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
        <div className="paddings flexCenter properties">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((card, i) => <RecentCard card={card} key={i} />)
          ) : (
            <p className="nothing">No properties match your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;