import React, { useEffect, useRef, useState } from "react";
import { useTimer } from "react-timer-hook";
import { FaAngleLeft } from "react-icons/fa";
import Logo from "../../pics/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import Framer Motion
import { Loader } from "lucide-react";

const OTPVerification = () => {
  const [otpResend, setOtpResend] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { error, isLoading, verifyEmail, resendVerificationEmail, user } =
    useAuthStore();

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 60); // 60 seconds timer

  const { seconds, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => setOtpResend(true),
  });

  const handleResendOTP = async () => {
    if (!user?.email) {
      toast.error("User email not found. Please try again.");
      return;
    }

    try {
      console.log("Resending OTP to:", user.email);
      await resendVerificationEmail(user.email);
      setOtpResend(false);

      const newExpiryTimestamp = new Date();
      newExpiryTimestamp.setSeconds(newExpiryTimestamp.getSeconds() + 60);
      restart(newExpiryTimestamp);

      toast.success("OTP resent successfully");
    } catch (error) {
      console.log("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
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
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      navigate("/verified");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <motion.div
      className="forgotPage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="logo">
        <img src={Logo} alt="" />
      </div>
      <motion.div
        className="form"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FaAngleLeft className="back-arrow" onClick={() => navigate(-1)} />
        <h1>
          <span>Verify Email</span>
        </h1>
        <p>We have sent a one-time passcode to your email.</p>
        <motion.div
          className="otp"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h1>Kindly enter your one-time pass-code here.</h1>
          <div className="otp-input">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                className="otp-container"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="6"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                ))}
              </motion.div>
              {error && (
                <p className="text-red-500 font-semibold mt-2 err-p">{error}</p>
              )}
              <div style={{ paddingTop: "3rem" }} className="buttons">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading || code.some((digit) => !digit)}
                  className="registerButton w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    "Verify Email"
                  )}
                </motion.button>
              </div>
            </form>
          </div>
          <motion.a
            onClick={otpResend ? handleResendOTP : undefined}
            style={{ cursor: otpResend ? "pointer" : "default" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Didn’t get a code?{" "}
            {otpResend ? (
              <span>Resend OTP</span>
            ) : (
              <span>Resend in {seconds}s</span>
            )}
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default OTPVerification;