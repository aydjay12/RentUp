// Recent.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Heading from "../../common/Heading";
import "./recent.css";
import RecentCard from "./RecentCard";
import { useResidencyStore } from "../../../store/useResidencyStore";
import { PuffLoader } from "react-spinners";

const Recent = () => {
  const { residencies, fetchAllResidencies, loading, isError } =
    useResidencyStore();

  useEffect(() => {
    fetchAllResidencies();
  }, [fetchAllResidencies]);

  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while fetching data</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );
  }

  return (
    <section className="recent">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <Heading
            title="Featured Properties"
            subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
          />
        </motion.div>

        <motion.div
          className="recent-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {residencies.length > 0 ? (
            residencies
              .slice(0, 6)
              .map((card, i) => <RecentCard key={i} card={card} />)
          ) : (
            <motion.div
              className="no-residency"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: "1rem",
                color: "#2d3954",
                marginBottom: "4rem",
                fontWeight: "600",
              }}
            >
              No Properties Found
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Recent;
