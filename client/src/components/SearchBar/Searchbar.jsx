import React from "react";
import { Search } from "lucide-react";

const Searchbar = ({ filter, setFilter }) => {
  return (
    <div className="search-bar-wrapper shadow">
      <Search className="search-icon" size={20} />
      <input
        placeholder="Search..."
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <button className="search-btn-v2" aria-label="Search">
        <span className="btn-text">Search</span>
        <Search className="btn-icon" size={20} />
      </button>
    </div>
  );
};

export default Searchbar;
