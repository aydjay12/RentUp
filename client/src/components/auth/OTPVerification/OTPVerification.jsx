import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-toastify";
import { Loader, ArrowLeft } from "lucide-react";
import Logo from "../../pics/logo.png";
import "../../../styles/auth_modern.scss";

const OTPVerification = () => {
  const navigate = useNavigate();
  const { verifyEmail, resendVerification, isLoading, error, clearError } = useAuthStore();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const [pendingUser, setPendingUser] = useState(null);

  useEffect(() => {
    clearError();
    const userStr = localStorage.getItem("pendingUser");
    if (userStr) {
      setPendingUser(JSON.parse(userStr));
    } else {
      // If no pending user, redirect to signup
      navigate("/signup");
    }
  }, [clearError, navigate]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer, canResend]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];

    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split("");
      pastedCode.forEach((char, i) => {
        if (index + i < 6) newCode[index + i] = char;
      });
      setCode(newCode);
      const targetIndex = Math.min(index + pastedCode.length, 5);
      inputRefs.current[targetIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    try {
      await verifyEmail(pendingUser.email, verificationCode);
      toast.success("Email verified successfully!");
      localStorage.removeItem("pendingUser");
      navigate("/verified");
    } catch (err) {
      // Error handled by store
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification(pendingUser.email);
      setCanResend(false);
      setResendTimer(60);
      toast.success("Verification code resent!");
    } catch (err) {
      // Error handled by store
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [code]);

  return (
    <div className="auth-page">
      <Link to="/signup" className="back-link">
        <ArrowLeft size={18} />
        Back to Signup
      </Link>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-header">
          <img src={Logo} alt="RentUp Logo" className="auth-logo" />
          <h2>Verify Email</h2>
          <p>
            We've sent a 6-digit code to <br />
            <strong>{pendingUser?.email}</strong>
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="6"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          {error && <div className="error-hint text-center">{error}</div>}

          <button className="auth-btn" type="submit" disabled={isLoading || code.some(d => !d)}>
            {isLoading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              "Verify Code"
            )}
          </button>
        </form>

        <div className="resend-section">
          Didn't receive the code?
          <button
            className="resend-btn"
            onClick={handleResend}
            disabled={!canResend || isLoading}
          >
            {canResend ? "Resend Secret Code" : `Resend in ${resendTimer}s`}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerification;