import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import {
  Loader, Eye, EyeOff, ArrowLeft,
  User, ShieldCheck, CheckCircle
} from "lucide-react";
import Logo from "../../pics/logo-light.png";
import Snackbar from "../../common/Snackbar/Snackbar";
import { useSnackbar } from "../../../hooks/useSnackbar";
import "../../../styles/auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isLoading, error, clearError } = useAuthStore();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const from = location.state?.from?.pathname || "/";
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: true,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    clearError();
  }, [clearError]);

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
    if (!formData.username.trim()) errors.username = "Username is required";
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(formData.password)) {
      errors.password = "Must contain 8+ chars, 1 uppercase, & 1 symbol";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role,
        });

        localStorage.setItem(
          "pendingUser",
          JSON.stringify({ email: formData.email, role: role, redirectTo: from })
        );

        showSnackbar("Account created! Sending verification code...", "success");
        setTimeout(() => navigate("/otp-verification"), 1500);
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
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
      <div className="signup-visual">
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
              Find your dream home today.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Join thousands of users finding, renting, and listing properties with ease and security.
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
            <h2>Create an account</h2>
            <p>Start your real estate journey with us.</p>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            {/* Role Selection Cards */}
            <div className="role-selection-group">
              <label className="field-label">I am a:</label>
              <div className="role-cards">
                <div
                  className={`role-card ${role === "user" ? "active" : ""}`}
                  onClick={() => setRole("user")}
                >
                  <User size={20} />
                  <span>User</span>
                  {role === "user" && <CheckCircle size={16} className="check-icon" />}
                </div>
                <div
                  className={`role-card ${role === "admin" ? "active" : ""}`}
                  onClick={() => setRole("admin")}
                >
                  <ShieldCheck size={20} />
                  <span>Admin</span>
                  {role === "admin" && <CheckCircle size={16} className="check-icon" />}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  className={formErrors.username ? "input-error" : ""}
                />
                {formErrors.username && <span className="error-text">{formErrors.username}</span>}
              </div>

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
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
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
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repeat password"
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

            {/* <div className="terms-group">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span className="label-text">
                  I agree to the <Link to="/terms">Terms</Link> & <Link to="/privacy">Privacy Policy</Link>
                </span>
              </label>
              {formErrors.terms && <p className="error-text terms-error">{formErrors.terms}</p>}
            </div> */}

            {error && <div className="server-error">{error}</div>}

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? <Loader className="animate-spin" size={20} /> : "Create Account"}
            </button>

            <p className="login-redirect">
              Already have an account? <Link to="/signin" state={{ from: location.state?.from || location }}>Sign in</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;