import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-toastify";
import { Loader, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Logo from "../../pics/logo.png";
import "../../../styles/auth_modern.scss";

const ForgotPassword = () => {
  const { isLoading, error, forgotPassword, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success("Reset link sent!");
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <div className="auth-page">
      <Link to="/signin" className="back-link">
        <ArrowLeft size={18} />
        Back to Signin
      </Link>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-header">
          <img src={Logo} alt="RentUp Logo" className="auth-logo" />
          <h2>Forgot Password</h2>
          {!isSubmitted ? (
            <p>Enter your email and we'll send you a link to reset your password.</p>
          ) : (
            <p>Success! We've sent a link to reset your password.</p>
          )}
        </div>

        {!isSubmitted ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="error-hint text-center">{error}</div>}

            <button className="auth-btn" type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center" style={{ padding: '1rem 0' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}
            >
              <CheckCircle size={64} color="#10b981" />
            </motion.div>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
              If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
              Please check your inbox and spam folder.
            </p>
            <Link to="/signin" className="auth-btn">
              Return to Login
            </Link>
          </div>
        )}

        <div className="auth-footer">
          Remembered your password? <Link to="/signin">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
