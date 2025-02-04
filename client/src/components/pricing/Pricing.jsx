import React from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import Back from "../common/Back";
import PriceCard from "../home/price/PriceCard";
import img from "../images/pricing.jpg";
import "../home/price/price.css";

const Pricing = () => {
  // Animation variants for the Back component
  const backVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  // Animation variants for the PriceCard container
  const priceContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.5 },
    },
  };

  // Animation variants for individual PriceCards
  const priceCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden" // Add exit animation if needed
    >
      <section className="pricing mb">
        {/* Animate the Back component */}
        <motion.div variants={backVariants}>
          <Back
            name="30 days money back guarantee"
            title="No Extra Fees. Friendly Support"
            cover={img}
          />
        </motion.div>

        {/* Animate the PriceCard container */}
        <motion.div
          className="price container"
          variants={priceContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Animate individual PriceCards */}
          <motion.div variants={priceCardVariants}>
            <PriceCard />
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Pricing;