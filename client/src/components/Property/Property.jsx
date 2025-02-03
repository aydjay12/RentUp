import React from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { getProperty } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { FaShower } from "react-icons/fa";
import { AiTwotoneCar } from "react-icons/ai";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import Heart from "../../components/Heart/Heart";
import { motion } from "framer-motion";
import "./Property.css";

const Property = () => {
  const { pathname } = useLocation();
  const id = pathname.split("/").pop();
  const { data, isLoading, isError } = useQuery(["resd", id], () => getProperty(id));
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="wrapper flexCenter paddings">
        <PuffLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="wrapper flexCenter paddings">
        <span>Error while fetching the property details</span>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flexColStart paddings innerWidth property-container">
        <motion.div className="like" whileHover={{ scale: 1.1 }}>
          <Heart id={id} />
        </motion.div>

        <motion.img src={data?.image} alt="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />

        <motion.div className="flexCenter property-details" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flexColStart left">
            <motion.span className="primaryText" whileHover={{ scale: 1.05 }}>{data?.title}</motion.span>
            <div className="flexStart facilities">
              <div className="flexStart facility"><FaShower size={20} /><span>{data?.facilities?.bathrooms} Bathrooms</span></div>
              <div className="flexStart facility"><AiTwotoneCar size={20} /><span>{data?.facilities?.parkings} Parking</span></div>
              <div className="flexStart facility"><MdMeetingRoom size={20} /><span>{data?.facilities?.bedrooms} Room/s</span></div>
            </div>
            <motion.span className="secondaryText" whileHover={{ scale: 1.05 }}>{data?.description}</motion.span>
            <div className="flexStart" style={{ gap: "1rem" }}>
              <MdLocationPin size={25} /><span className="secondaryText">{data?.address}, {data?.city}, {data?.country}</span>
            </div>
          </div>
          <motion.div className="map" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <span className="primaryText" style={{ fontSize: "1.5rem" }}>{data?.type}</span>
            <span className="orangeText" style={{ fontSize: "1.5rem" }}>$ {data?.price} /sqft</span>
            <motion.button className="button" onClick={() => navigate("/pricing")} whileHover={{ scale: 1.1 }}>Make Your Payment</motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Property;