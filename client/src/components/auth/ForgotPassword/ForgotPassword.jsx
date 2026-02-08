import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { Loader, ArrowLeft, CheckCircle } from "lucide-react";
import Logo from "../../pics/logo-light.png";
import useSnackbarStore from "../../../store/useSnackbarStore";
import "../../../styles/auth.css";

const ForgotPassword = () => {
  const { isLoading, error, forgotPassword, clearError } = useAuthStore();
  const { showSnackbar } = useSnackbarStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showSnackbar("Please enter your email", "error");
      return;
    }
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      showSnackbar("Reset link sent!", "success");
    } catch (err) {
      const errorMessage = err.response?.data?.message || (typeof error === 'string' ? error : "Failed to send reset email");
      showSnackbar(errorMessage, "error");
    }
  };

  return (
    <div className="signup-container">


      {/* LEFT SIDE - VISUAL */}
      <div className="signup-visual" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/pic02.jpeg')" }}>
        <div className="visual-overlay"></div>
        <div className="visual-content">
          <Link to="/signin" className="back-link-visual">
            <ArrowLeft size={20} /> Back to Sign In
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
              Recover your account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Lost your password? It happens. Enter your email and we'll help gets you back on track.
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
            <Link to="/signin" className="mobile-back"><ArrowLeft size={18} /></Link>
            <img src={Logo} alt="Logo" className="mobile-logo" />
          </div>

          <div className="form-header">
            <h2>Forgot Password</h2>
            {!isSubmitted ? (
              <p>Enter your email and we'll send you a link to reset your password.</p>
            ) : (
              <p>Check your email for instructions.</p>
            )}
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="modern-form">
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className=""
                  required
                />
              </div>

              {error && <div className="server-error">{error}</div>}

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" size={20} /> : "Send Reset Link"}
              </button>

              <p className="login-redirect">
                Remembered your password? <Link to="/signin">Sign In</Link>
              </p>
            </form>
          ) : (
            <div style={{ marginTop: '1rem' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ marginBottom: '1.5rem', display: 'none', justifyContent: 'center' }}
              >
                <CheckCircle size={64} color="#27ae60" />
              </motion.div>
              <p style={{ color: '#6b7280', fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem', marginBottom: '5rem', marginTop: '2rem' }}>
                If an account exists for <strong style={{ color: '#1e293b' }}>{email}</strong>, you will receive a password reset link shortly. Use the reset link to reset your password.
              </p>
              <Link to="/signin" className="submit-btn" style={{ textDecoration: 'none' }}>
                Return to Sign In
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;

