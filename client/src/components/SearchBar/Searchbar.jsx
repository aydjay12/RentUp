import React from "react";
import { Search } from "lucide-react";

const Searchbar = ({ filter, setFilter }) => {
  return (
    <div className="search-bar-wrapper shadow">
      <Search className="search-icon" size={20} />
      <input
        placeholder="Search properties by title, city, or address..."
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <button className="search-btn-v2">Search</button>
    </div>
  );
};

export default Searchbar;
