import React, { useEffect, useState } from "react";
import "../signup/signup.scss";
import { GoEye } from "react-icons/go";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import Logo from "../../pics/logo.png";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-toastify";
import { Loader } from "lucide-react"; // Import for loading spinner
import { motion } from "framer-motion"; // Import Framer Motion

const NewPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, isLoading, error } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showMsg, setShowMsg] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Validate input
  const validate = () => {
    const newErrors = { password: "", confirmPassword: "" };

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least 8 characters, one uppercase letter, and one symbol";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  useEffect(() => {
    validate();
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowMsg(true);

    if (!validate()) return;

    try {
      await resetPassword(token, formData.password);
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      toast.error(err?.message || "Error resetting password");
    }
  };

  return (
    <motion.div
      className="newPassword"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <motion.form
        className="form"
        noValidate
        onSubmit={handleSubmit}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FaAngleLeft className="back-arrow" onClick={() => navigate(-1)} />
        <h1>
          <span>Enter Your New Password</span>
        </h1>
        <motion.div
          className="password-input"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <label>Password</label>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <motion.div
              className="eye"
              onClick={handleShowPassword}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: showPassword ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {showPassword ? <GoEye /> : <FaRegEyeSlash />}
            </motion.div>
          </div>
          {showMsg && errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </motion.div>

        <motion.div
          className="confirm-password-input"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <label>Confirm Password</label>
          <div className="input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <motion.div
              className="eye"
              onClick={handleShowConfirmPassword}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: showConfirmPassword ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {showConfirmPassword ? <GoEye /> : <FaRegEyeSlash />}
            </motion.div>
          </div>
          {showMsg && errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}
          {error && (
            <p className="error-message text-red-500 font-semibold mt-2 err-p">
              {error}
            </p>
          )}
        </motion.div>

        <motion.div
          className="buttons"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <button type="submit" className="registerButton">
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Submit"
            )}
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default NewPassword;
