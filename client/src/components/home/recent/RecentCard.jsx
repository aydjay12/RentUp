import React from "react";
import { FaHeart } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Heart from "../../Heart/Heart";

const RecentCard = ({ card }) => {
  const navigate = useNavigate();
  return (
    <div className="box shadow">
      <div className="img" onClick={() => navigate(`../properties/${card.id}`)}>
        <img src={card.image} alt={card.title} />
      </div>
      <div className="text">
        <div className="category flex">
          <span
            style={{
              background:
                card.status === "For Sale" ? "#25b5791a" : "#ff98001a",
                color: card.status === "For Sale" ? "#25b579" : "#ff9800",
            }}
          >
            {card.status}
          </span>
          <div className="heart-icon">
            <Heart id={card?.id}/>
          </div>
        </div>
        <h4>{card.title}</h4>
        <p>
          <HiLocationMarker /> {card.address}, <span>{card.city}</span>
        </p>
      </div>
      <div className="flex padd">
        <div>
          <button className="btn2 price-btn">${card.price}</button> <span>/sqft</span>
        </div>
        <span>{card.type}</span>
      </div>
    </div>
  );
};

export default RecentCard;
