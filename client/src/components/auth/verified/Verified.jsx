import React from "react";
import "./verified.scss";
import Logo from "../../pics/logo.png";
import tick from "../../../../public/svg/tick.svg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion

const Verified = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="verifiedPage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="logo">
        <img src={Logo} alt="" />
      </div>
      <motion.div
        className="message"
      >
        <motion.img
          className="tick"
          src={tick}
          alt=""
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Email Verification
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Hi Dear User, You Have Successfully Verified Your Email.
        </motion.p>
        <motion.button
          onClick={() => navigate("/home")}
          className="doneButton"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Done
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Verified;