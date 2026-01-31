import React from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import Logo from "../../pics/logo.png";
import "../../../styles/auth_modern.scss";

const PasswordSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-header">
          <img src={Logo} alt="RentUp Logo" className="auth-logo" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}
          >
            <CheckCircle size={80} color="#10b981" />
          </motion.div>
          <h2>Password Reset!</h2>
          <p>Your password has been reset successfully. You can now log in with your new password.</p>
        </div>

        <button
          className="auth-btn"
          onClick={() => navigate("/signin")}
          style={{ width: '100%' }}
        >
          Go to Sign In
          <ArrowRight size={20} />
        </button>

        <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
          Secure and Ready!
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordSuccess;