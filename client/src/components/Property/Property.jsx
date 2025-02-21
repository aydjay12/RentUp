import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { FaShower } from "react-icons/fa";
import { AiTwotoneCar } from "react-icons/ai";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import Heart from "../../components/Heart/Heart";
import { motion } from "framer-motion";
import { useResidencyStore } from "../../store/useResidencyStore";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/authStore"; // ✅ Import auth store
import "./Property.css";
import { toast } from "react-toastify";

const Property = () => {
  const { propertyId: id } = useParams();
  const { fetchResidencyById } = useResidencyStore();
  const { cartItems, toggleCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore(); // ✅ Get auth state
  const [property, setProperty] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      setIsFetching(true);
      try {
        const data = await fetchResidencyById(id);
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProperty();
  }, [id, fetchResidencyById]);

  const isInCart = cartItems.some((item) => item._id === id);

  const handleToggleCart = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to add to cart", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    if (!user?.isVerified) {
      toast.error("You must be verified to add this to the cart", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return navigate("/otp-verification");
    }

    toggleCart(id);
  };

  if (isFetching) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="wrapper flexCenter paddings">
        <span className="error-message">Error fetching property details</span>
      </div>
    );
  }

  return (
    <motion.div
      className="property-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="property-container">
        <motion.div className="like" whileHover={{ scale: 1.1 }}>
          <Heart id={id} />
        </motion.div>

        <motion.img
          src={property?.image}
          alt="home"
          className="property-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <div className="property-details">
          <div className="property-info">
            <motion.h1 className="property-title" whileHover={{ scale: 1 }}>
              {property?.title}
            </motion.h1>

            <div className="facilities">
              <div className="facility">
                <FaShower size={20} />
                <span>{property?.facilities?.bathrooms} Bathrooms</span>
              </div>
              <div className="facility">
                <AiTwotoneCar size={20} />
                <span>{property?.facilities?.parkings} Parking</span>
              </div>
              <div className="facility">
                <MdMeetingRoom size={20} />
                <span>{property?.facilities?.bedrooms} Room/s</span>
              </div>
            </div>

            <motion.p
              className="property-description"
              whileHover={{ scale: 1 }}
            >
              {property?.description}
            </motion.p>

            <div className="property-location">
              <MdLocationPin size={25} />
              <span>
                {property?.address}, {property?.city}, {property?.country}
              </span>
            </div>
          </div>

          <motion.div
            className="property-pricing"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="property-type">{property?.type}</h2>
            <h3 className="property-price">$ {property?.price} /sqft</h3>

            {/* ✅ Toggle Cart Button */}
            <motion.div
              style={{
                wordSpacing: ".1em",
                background: isInCart ? "white" : "#27ae60",
                color: isInCart ? "#e74c3c" : "white",
                border: `2px solid ${isInCart ? "#e74c3c" : "transparent"}`,
              }}
              className="button"
              onClick={handleToggleCart}
              whileHover={{ scale: 1.1 }}
            >
              {isInCart ? "Remove from Cart" : "Add to Cart"}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Property;
