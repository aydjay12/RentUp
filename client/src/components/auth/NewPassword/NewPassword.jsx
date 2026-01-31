import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-toastify";
import { Loader, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import Logo from "../../pics/logo.png";
import "../../../styles/auth_modern.scss";

const NewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Get token from query string
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    clearError();
    if (!token) {
      toast.error("Invalid or missing reset token");
      navigate("/signin");
    }
  }, [clearError, token, navigate]);

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
    if (validate()) {
      try {
        await resetPassword(token, formData.password);
        setIsSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => navigate("/password-reset-successful"), 2000);
      } catch (err) {
        // Error handled by store
      }
    }
  };

  return (
    <div className="auth-page">
      <Link to="/signin" className="back-link">
        <ArrowLeft size={18} />
        Back to Login
      </Link>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-header">
          <img src={Logo} alt="RentUp Logo" className="auth-logo" />
          <h2>New Password</h2>
          <p>Please enter your new strong password</p>
        </div>

        {!isSuccess ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>New Password</label>
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
              <label>Confirm New Password</label>
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

            {error && <div className="error-hint text-center">{error}</div>}

            <button className="auth-btn" type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center" style={{ padding: '2rem 0' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}
            >
              <CheckCircle size={64} color="#10b981" />
            </motion.div>
            <h3 style={{ marginBottom: '1rem', color: '#0f172a' }}>Success!</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              Your password has been reset successfully. Redirecting you to the login page...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NewPassword;
