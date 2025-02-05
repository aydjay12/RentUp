import React, { useCallback, useEffect, useState } from "react";
import "./forgot-password.scss";
import { FaAngleLeft } from "react-icons/fa";
import Logo from "../../pics/logo.png";
import { OtpInput } from "reactjs-otp-input";
import { useTimer } from "react-timer-hook";

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
  });
  const [showMsg, setShowMsg] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [emailEntered, setEmailEntered] = useState(false);
  const [otpResend, setOtpResend] = useState(false);
  const sendOtp = () => {};

  return (
    <div className="forgotPage">
      <div className="logo">
        <img src={Logo} alt="" />
      </div>
      <form className="form" noValidate>
        <FaAngleLeft className="back-arrow" />
        <h1>
          <span>Forgot Password</span>
        </h1>
        <p>
          {!emailEntered
            ? "Enter the email associated with your account and we’ll send an email with a one-time passcode to reset your password."
            : "We have sent a one-time passcode to your email."}
        </p>
        {!emailEntered ? (
          <>
            <div className="email-input">
              <label>
                Email <span>*</span>
              </label>
              <input
                type="email"
                name="email"
              />
              {showMsg && errors.email && (
                <p className="error-message">{errors.email}</p>
              )}
            </div>
          </>
        ) : (
          <div className="otp">
            <h1>Kindly enter your one-time pass-code here.</h1>
            <div className="otp-input">
              <OtpInput
                isInputNum
                numInputs={6}
                containerStyle={"inputs"}
                focusStyle={"inputFocused"}
              />
            </div>
            <p>
              Didn’t get a code?{" "}
              {otpResend ? (
                <span>Resend OTP</span>
              ) : (
                <span>Resend in {}s</span>
              )}
            </p>
          </div>
        )}
        <div style={{ paddingTop: "3rem" }} className="buttons">
          <button
            type="submit"
            className="registerButton"
            disabled={emailEntered && formData.otp.length !== 6}
          >
            {!emailEntered ? "Reset Password" : "Verify"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
