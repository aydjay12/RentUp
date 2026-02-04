import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import Logo from "../../pics/logo-light.png";
import "../../../styles/auth.css";

const PasswordSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/signin");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="signup-container">
      {/* LEFT SIDE - VISUAL */}
      <div className="signup-visual" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/pic05.jpeg')" }}>
        <div className="visual-overlay"></div>
        <div className="visual-content">
          <Link to="/" className="back-link-visual">
            <ArrowLeft size={20} /> Back to Home
          </Link>

          <div className="visual-text">
            <motion.img
              src={Logo}
              alt="RentUp"
              className="visual-logo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              All Set!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Your security is updated. Welcome back to RentUp.
            </motion.p>
          </div>

          <div className="visual-footer">
            <p>© 2024 RentUp Real Estate. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="signup-form-section">
        <motion.div
          className="form-wrapper"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mobile-header">
            <Link to="/" className="mobile-back"><ArrowLeft size={18} /></Link>
            <img src={Logo} alt="Logo" className="mobile-logo" />
          </div>

          <div className="form-header" style={{ textAlign: 'center' }}>
            <h2>Success!</h2>
            <p>Your password has been reset.</p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              style={{ marginBottom: '2rem' }}
            >
              <CheckCircle size={80} color="#27ae60" strokeWidth={2} />
            </motion.div>

            <button
              className="submit-btn"
              onClick={() => navigate("/signin")}
              style={{ width: '100%', maxWidth: '300px', marginBottom: '1rem' }}
            >
              Go to Sign In
              <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </button>

            <p className="login-redirect">
              Redirecting in 5 seconds...
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PasswordSuccess;