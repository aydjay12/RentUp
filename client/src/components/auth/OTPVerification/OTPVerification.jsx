import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { Loader, ArrowLeft } from "lucide-react";
import Logo from "../../pics/logo-light.png";
import Snackbar from "../../common/Snackbar/Snackbar";
import { useSnackbar } from "../../../hooks/useSnackbar";
import "../../../styles/auth.css";

const OTPVerification = () => {
  const navigate = useNavigate();
  const { verifyEmail, resendVerification, isLoading, error, clearError } = useAuthStore();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const [pendingUser, setPendingUser] = useState(null);

  useEffect(() => {
    clearError();
    const userStr = localStorage.getItem("pendingUser");
    if (userStr) {
      setPendingUser(JSON.parse(userStr));
    } else {
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

  const handlePaste = (index, e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedNumbers = pastedData.replace(/\D/g, "").slice(0, 6).split("");

    if (pastedNumbers.length === 0) return;

    const newCode = [...code];
    pastedNumbers.forEach((char, i) => {
      if (index + i < 6) {
        newCode[index + i] = char;
      }
    });

    setCode(newCode);

    const targetIndex = Math.min(index + pastedNumbers.length, 5);
    if (inputRefs.current[targetIndex]) {
      inputRefs.current[targetIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      showSnackbar("Please enter the full 6-digit code", "error");
      return;
    }

    try {
      await verifyEmail(pendingUser.email, verificationCode);
      showSnackbar("Email verified successfully!", "success");
      const redirectPath = pendingUser.redirectTo || "/";
      localStorage.removeItem("pendingUser");
      setTimeout(() => navigate(redirectPath), 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || (typeof error === 'string' ? error : "Verification failed. Please try again.");
      showSnackbar(errorMessage, "error");
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      await resendVerification(pendingUser.email);
      setCanResend(false);
      setResendTimer(60);
      showSnackbar("Verification code resent!", "success");
    } catch (err) {
      const errorMessage = err.response?.data?.message || (typeof error === 'string' ? error : "Failed to resend code");
      showSnackbar(errorMessage, "error");
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [code]);

  return (
    <div className="signup-container">
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={hideSnackbar}
      />

      {/* LEFT SIDE - VISUAL */}
      <div className="signup-visual" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/landing/about3.jpeg')" }}>
        <div className="visual-overlay"></div>
        <div className="visual-content">
          <Link to="/signup" className="back-link-visual">
            <ArrowLeft size={20} /> Back to Sign Up
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
              Verify it's you
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              To protect your account, please verify your email address. It only takes a minute.
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
            <Link to="/signup" className="mobile-back"><ArrowLeft size={18} /></Link>
            <img src={Logo} alt="Logo" className="mobile-logo" />
          </div>

          <div className="form-header">
            <h2>Verify Code</h2>
            <p>
              We've sent a code to <strong style={{ color: '#27ae60' }}>{pendingUser?.email}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="otp-inputs" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'start', margin: '1rem 0', marginTop: '0', width: '100%' }}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handlePaste(index, e)}
                  style={{
                    width: '55px',
                    height: '55px',
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: '#f9fafb',
                    fontFamily: "'Outfit', sans-serif",
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#27ae60'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              ))}
            </div>

            {error && <div className="server-error">{error}</div>}

            <button type="submit" className="submit-btn" disabled={isLoading || isResending || code.some(d => !d)}>
              {isLoading && !isResending ? <Loader className="animate-spin" size={20} /> : "Verify Code"}
            </button>

            <div className="resend-section" style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6b7280', fontFamily: "'Outfit', sans-serif" }}>
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || isLoading || isResending}
                style={{
                  background: 'none',
                  border: 'none',
                  color: (canResend && !isResending) ? '#27ae60' : '#9ca3af',
                  fontWeight: '600',
                  cursor: (canResend && !isResending) ? 'pointer' : 'default',
                  fontFamily: 'inherit',
                  padding: 0
                }}
              >
                {isResending ? "Resending Code..." : canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default OTPVerification;