import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { Loader, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Logo from "../../pics/logo-light.png";
import Snackbar from "../../common/Snackbar/Snackbar";
import { useSnackbar } from "../../../hooks/useSnackbar";
import "../../../styles/auth.css";

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    clearError();
  }, [clearError]);

  const validate = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await login({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        });



        showSnackbar("Welcome back!", "success");
        setTimeout(() => navigate(from), 1000);
      } catch (err) {
        const errorMessage = err.response?.data?.message || (typeof error === 'string' ? error : "Login failed. Please try again.");
        showSnackbar(errorMessage, "error");
      }
    }
  };

  return (
    <div className="signup-container">
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={hideSnackbar}
      />

      {/* LEFT SIDE - VISUAL */}
      <div className="signup-visual" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/pic01.jpeg')" }}>
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
              Welcome Back!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Sign in to access your properties, manage listings, and stay connected with your real estate journey.
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

          <div className="form-header">
            <h2>Sign In</h2>
            <p>Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? "input-error" : ""}
              />
              {formErrors.email && <span className="error-text">{formErrors.email}</span>}
            </div>

            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Password</label>
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot Password?
                </Link>
              </div>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className={formErrors.password ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.password && <span className="error-text">{formErrors.password}</span>}
            </div>

            <div className="terms-group" style={{ marginTop: '0.5rem' }}>
              <div className="remember-me">
                <div>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
              </div>
            </div>

            {error && <div className="server-error">{error}</div>}

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? <Loader className="animate-spin" size={20} /> : "Sign In"}
            </button>

            <p className="login-redirect">
              Don't have an account? <Link to="/signup" state={{ from: location.state?.from || location }}>Create Account</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Signin;
