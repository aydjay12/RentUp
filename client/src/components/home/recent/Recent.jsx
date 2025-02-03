import React from "react";
import { motion } from "framer-motion"; // Import framer-motion
import Heading from "../../common/Heading";
import "./recent.css";
import RecentCard from "./RecentCard";
import useProperties from "../../../hooks/useProperties";
import { PuffLoader } from "react-spinners";

const Recent = () => {
  const { data, isError, isLoading } = useProperties();

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
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#27ae60"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  return (
    <>
      <section className="recent">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Heading
              title="Recent Property Listed"
              subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
            />
          </motion.div>
          <motion.div
            className="recent-container"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {data.slice(0, 6).map((card, i) => (
              <RecentCard key={i} card={card} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Recent;