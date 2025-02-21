import React from "react";
import { motion } from "framer-motion"; // Import framer-motion
import Heading from "../../common/Heading";
import { team } from "../../data/Data";
import "./team.css";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const Team = () => {
  return (
    <>
      <section className="team">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Heading
              title="Our Featured Agents"
              subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
            />
          </motion.div>
          <motion.div
            className="content mtop grid3"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            {team.map((val, index) => (
              <motion.div
                className="box"
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 100,  }}
              >
                <button className="listings">{val.list} Listings</button>
                <div className="details">
                  <div className="img">
                    <img src={val.cover} alt="" />
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <i className="fa fa-location-dot"></i>
                  <label>{val.address}</label>
                  <h4>{val.name}</h4>
                  <ul>
                    {val.icon.map((icon, index) => (
                      <a href="mailto:aydjay12@gmail.com" key={index}>
                        <li>{icon}</li>
                      </a>
                    ))}
                  </ul>
                  <div className="pad flex">
                    <a href="mailto:aydjay12@gmail.com">
                      <button className="message">
                        <FaEnvelope /> Message
                      </button>
                    </a>
                    <a href="mailto:aydjay12@gmail.com">
                      <button className="call">
                        <FaPhoneAlt />
                      </button>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Team;