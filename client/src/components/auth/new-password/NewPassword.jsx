import React, { useEffect, useState } from "react";
import "../signup/signup.scss";
import { GoEye } from "react-icons/go";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import Logo from "../../pics/logo.png";
import { useNavigate } from "react-router-dom";

const NewPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });
  const [showMsg, setShowMsg] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const validate = () => {
    const newErrors = {
      password: "",
      confirmPassword: "",
    };

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

    return !Object.values(newErrors).some((error) => error != "");
  };

  useEffect(() => {
    validate();
  }, [formData]);

  return (
    <div className="newPassword">
      <div className="logo">
        <img src={Logo} alt="" />
      </div>
      <form className="form" noValidate>
        <FaAngleLeft className="back-arrow" />
        <h1>
          <span>Enter Your New Password</span>
        </h1>
        <div className="password-input">
          <label>Password</label>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
            />
            <div className="eye" onClick={handleShowPassword}>
              {showPassword ? <GoEye /> : <FaRegEyeSlash />}
            </div>
          </div>
          {showMsg && errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </div>
        <div className="confirm-password-input">
          <label>Confirm Password</label>
          <div className="input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              required
            />
            <div className="eye" onClick={handleShowConfirmPassword}>
              {showConfirmPassword ? <GoEye /> : <FaRegEyeSlash />}
            </div>
          </div>
          {showMsg && errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}
        </div>
        <div className="buttons">
          <button type="submit" className="registerButton">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPassword;
