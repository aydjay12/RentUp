import React, { useEffect, useState } from "react";
import "./signin.scss";
import { GoEye } from "react-icons/go";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import GoogleIcon from "../../../../public/svg/google.svg";
import Logo from "../../pics/logo.png";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [showMsg, setShowMsg] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    agreedToTerms: false,
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least 8 characters, one uppercase letter, and one symbol";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error != "");
  };

  useEffect(() => {
    validate();
  }, [formData]);

  return (
    <div className="signinPage">
      <div className="logo">
        <img src={Logo} alt="" />
      </div>
      <form className="form" noValidate>
        <FaAngleLeft className="back-arrow" />
        <h1>
          Welcome <span>Back !!</span>
        </h1>
        <p>
          Don't have an account? <a onClick={() => navigate("/signup")}>Sign Up</a>
        </p>
        <div className="email-input">
          <label>
            Email or Phone Number <span>*</span>
          </label>
          <input
            type="email"
            name="email"
          />
          {showMsg && errors.email && (
            <p className="error-message">{errors.email}</p>
          )}
        </div>
        <div className="confirm-password-input">
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
        <div className="remember-me">
          <div>
            <input
              type="checkbox"
              id="rememberMe"
              checked={formData.agreedToTerms}
              onChange={(e) =>
                setFormData({ ...formData, agreedToTerms: e.target.checked })
              }
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          <span>
            <a onClick={() => navigate("/forgot-password")}>Forgot password?</a>
          </span>
        </div>
        <div className="buttons">
          <button type="submit" className="registerButton">
            Log In
          </button>
          <button type="button" className="signup-google">
            <img src={GoogleIcon} alt="" />
            Log In with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signin;
