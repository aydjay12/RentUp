import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { Loader, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Logo from "../../pics/logo-light.png";
import useSnackbarStore from "../../../store/useSnackbarStore";
import "../../../styles/auth.css";

const NewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  const { showSnackbar } = useSnackbarStore();
  const hasNavigated = useRef(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    clearError();
    if (!token) {
      showSnackbar("Invalid or missing reset token", "error");
      setTimeout(() => navigate("/signin"), 1500);
    }
  }, [clearError, token, navigate, showSnackbar]);

  // check password strength visually
  useEffect(() => {
    const pwd = formData.password;
    let strength = 0;
    if (pwd.length > 5) strength += 1;
    if (pwd.length > 7) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);

  const validate = () => {
    const errors = {};
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(formData.password)) {
      errors.password = "Must contain 8+ chars, 1 uppercase, and 1 symbol";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasNavigated.current) return;

    if (validate()) {
      try {
        await resetPassword(token, formData.password);
        hasNavigated.current = true;
        showSnackbar("Password reset successful!", "success");
        setTimeout(() => {
          navigate("/signin");
        }, 1000);
      } catch (err) {
        const errorMessage = err.response?.data?.message || (typeof error === 'string' ? error : "Password reset failed");
        showSnackbar(errorMessage, "error");
      }
    }
  };

  return (
    <div className="signup-container">


      {/* LEFT SIDE - VISUAL */}
      <div className="signup-visual" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/banner.png')" }}>
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
              Secure your account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Create a strong new password to keep your account safe and secure.
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
            <h2>New Password</h2>
            <p>Please enter your new strong password</p>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="input-group">
              <label>New Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter new password"
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

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="password-strength">
                  <div className={`strength-bar level-${passwordStrength}`}></div>
                </div>
              )}
              {formErrors.password && <span className="error-text">{formErrors.password}</span>}
            </div>

            <div className="input-group">
              <label>Confirm New Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repeat new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={formErrors.confirmPassword ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.confirmPassword && <span className="error-text">{formErrors.confirmPassword}</span>}
            </div>

            {error && <div className="server-error">{error}</div>}

            <button type="submit" className="submit-btn" disabled={isLoading || hasNavigated.current}>
              {isLoading ? <Loader className="animate-spin" size={20} /> : "Reset Password"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default NewPassword;

