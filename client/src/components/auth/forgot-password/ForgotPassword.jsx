import React, { useState } from "react";
import "./forgot-password.scss";
import { FaAngleLeft } from "react-icons/fa";
import Logo from "../../pics/logo.png";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const { isLoading, error, forgotPassword } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "" });
  const [emailEntered, setEmailEntered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(formData.email);
      toast.success("Password reset link sent! Check your email.");
      setEmailEntered(true);
    } catch (err) {
      toast.error(error);
    }
  };

  return (
    <motion.div
      className="forgotPage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>

      <motion.div
        className="form forgot-form"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <FaAngleLeft className="back-arrow" onClick={() => navigate(-1)} />
        <h1 className="forgot-header">
          <span>Forgot Password</span>
        </h1>

        {!emailEntered ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p>
              Enter the email associated with your account and we’ll send a
              password reset link to your mail.
            </p>
            <div className="email-input">
              <label>
                Email <span>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ email: e.target.value })}
                required
              />
            </div>
            <div style={{ paddingTop: "3rem" }} className="buttons">
              <motion.button
                type="submit"
                className="registerButton"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <Loader className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mail-container">
                <Mail className="mail-icon" />
              </div>
              <p>
                If an account exists for {formData.email}, you will receive a
                password reset link shortly.
              </p>
            </motion.div>
            <motion.div
              className="back-login-button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <a href="/signin">
                <ArrowLeft /> Back to Login
              </a>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
