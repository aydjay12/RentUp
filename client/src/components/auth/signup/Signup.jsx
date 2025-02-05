import React, { useEffect, useState, useContext } from "react";
import "./signup.scss";
import { GoEye } from "react-icons/go";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import GoogleIcon from "../../../../public/svg/google.svg";
import Logo from "../../pics/logo.png";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { signupUser } from "../../../utils/api";
import { toast } from "react-toastify";
import UserDetailContext from "../../../context/UserDetailContext";
import { useAuth0 } from "@auth0/auth0-react";

const Signup = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const { userDetails } = useContext(UserDetailContext);
  const { token } = userDetails;
  console.log("Token:", token);

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
    terms: "",
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validate = () => {
    const newErrors = {
      email: "",
      password: "",
      phone: "",
      confirmPassword: "",
      terms: "",
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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.phone.length === 0) {
      newErrors.phone = "Phone length must be greater than 1";
    }

    if (!formData.agreedToTerms) {
      newErrors.terms =
        "You must agree to the terms and conditions to register";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  useEffect(() => {
    validate();
  }, [formData]);

  const { mutate, isLoading } = useMutation({
    mutationFn: (formData) => signupUser(formData),
    onSuccess: () => {
      toast.success("You have logged in successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "#4CAF50",
          color: "#FFFFFF",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      });
      navigate("/");
    },
    onError: (error) => {
      toast.error("Unsuccessful login", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "#FF5252",
          color: "#FFFFFF",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      });
      console.error("Error submitting signup form:", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowMsg(true); // Ensure error messages are shown when user clicks submit
    if (validate()) {
      mutate({
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
    }
  };

  const handleGoogleSignup = () => {
    loginWithRedirect();
  };

  return (
    <div className="signupPage">
      <div className="logo">
        <img src={Logo} alt="" />
      </div>
      <form className="form" noValidate onSubmit={handleSubmit}>
        <FaAngleLeft className="back-arrow" onClick={() => navigate("/")} />
        <h1>
          Hello <span>There !!</span>
        </h1>
        <p>
          Have an account? <a onClick={() => navigate("/signin")}>Log In</a>
        </p>
        <div className="email-input">
          <label>
            Email <span>*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {showMsg && errors.email && (
            <p className="error-message">{errors.email}</p>
          )}
        </div>
        <div className="phone-number-input">
          <label>
            Phone Number <span>*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          {showMsg && errors.phone && (
            <p className="error-message">{errors.phone}</p>
          )}
        </div>
        <div className="password-input">
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
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <div className="eye" onClick={handleShowConfirmPassword}>
              {showConfirmPassword ? <GoEye /> : <FaRegEyeSlash />}
            </div>
          </div>
          {showMsg && errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
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
            <label htmlFor="rememberMe">
              I Agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          {showMsg && errors.terms && (
            <p className="error-message">{errors.terms}</p>
          )}
        </div>
        <div className="buttons">
          <button type="submit" className="registerButton">
            {isLoading ? "Registering..." : "Register"}
          </button>
          <button
            type="button"
            className="signup-google"
            onClick={handleGoogleSignup}
          >
            <img src={GoogleIcon} alt="" />
            Sign Up with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
