import React from "react";
import { motion } from "framer-motion"; // Import framer-motion
import Heading from "../../common/Heading";
import { awards } from "../../data/Data";
import "./awards.css";

const Awards = () => {
  return (
    <>
      <section className="awards padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Heading
              title="Over 1,240,000+ Happy User Being With Us Still They Love Our Services"
              subtitle="Our Awards"
            />
          </motion.div>
          <motion.div
            className="content grid4 mtop"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            {awards.map((val, index) => (
              <motion.div
                className="box"
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="icon">
                  <span>{val.icon}</span>
                </div>
                <h1>{val.num}</h1>
                <p>{val.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Awards;