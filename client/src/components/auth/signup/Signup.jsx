import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-toastify";
import { Loader, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Logo from "../../pics/logo.png";
import "../../../styles/auth_modern.scss";

const Signup = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    clearError();
  }, [clearError]);

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
      errors.password = "Must contain 8+ chars, 1 uppercase, and 1 symbol";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreedToTerms) {
      errors.terms = "You must agree to the terms";
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

        // Store pending user info for OTP verification
        localStorage.setItem(
          "pendingUser",
          JSON.stringify({
            email: formData.email,
            role: role,
          })
        );

        toast.success("Registration successful! verification code sent.");
        navigate("/otp-verification");
      } catch (err) {
        // Error is handled by store and displayed via toast or local state
      }
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} />
        Back to Home
      </Link>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-header">
          <img src={Logo} alt="RentUp Logo" className="auth-logo" />
          <h2>Create Account</h2>
          <p>Join our premium real estate community</p>
        </div>

        <div className="role-selector">
          <button
            className={role === "user" ? "active" : ""}
            onClick={() => setRole("user")}
          >
            User
          </button>
          <button
            className={role === "admin" ? "active" : ""}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="username"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={handleChange}
                className={formErrors.username ? "error" : ""}
              />
            </div>
            {formErrors.username && (
              <span className="error-hint">{formErrors.username}</span>
            )}
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? "error" : ""}
              />
            </div>
            {formErrors.email && (
              <span className="error-hint">{formErrors.email}</span>
            )}
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={formErrors.password ? "error" : ""}
              />
              <div
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {formErrors.password && (
              <span className="error-hint">{formErrors.password}</span>
            )}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={formErrors.confirmPassword ? "error" : ""}
              />
              <div
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {formErrors.confirmPassword && (
              <span className="error-hint">{formErrors.confirmPassword}</span>
            )}
          </div>

          <div className="terms-check">
            <input
              type="checkbox"
              id="agreedToTerms"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreedToTerms">
              I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
              <Link to="/privacy">Privacy Policy</Link>
            </label>
          </div>
          {formErrors.terms && (
            <span className="error-hint">{formErrors.terms}</span>
          )}

          {error && <div className="error-hint text-center">{error}</div>}

          <button className="auth-btn" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              "Create My Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/signin">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;