import React from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import { featured } from "../../data/Data";

const FeaturedCard = () => {
  const navigate = useNavigate();

  const handleClick = (type) => {
    // Navigate to search page with property type as query parameter
    navigate(`/search?propertyType=${encodeURIComponent(type)}`);
  };

  return (
    <>
      <div className='content grid5 mtop'>
        {featured.map((items, index) => (
          <div className='box' key={index} onClick={() => handleClick(items.type)} style={{ cursor: "pointer" }}>
            <img src={items.cover} alt='' />
            <h4>{items.type}</h4>
            <label>{items.total}</label>
          </div>
        ))}
      </div>
    </>
  );
};

export default FeaturedCard;
