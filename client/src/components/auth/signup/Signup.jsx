import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./signup.scss";
import { GoEye } from "react-icons/go";
import { FaRegEyeSlash, FaAngleLeft } from "react-icons/fa";
import GoogleIcon from "../../../../public/svg/google.svg";
import Logo from "../../pics/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, loginWithGoogle } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });
  const [showMsg, setShowMsg] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    terms: "",
  });

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const validate = () => {
    const newErrors = {
      email: "",
      password: "",
      name: "",
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

    if (!formData.name) {
      newErrors.name = "Username is required";
    }

    if (!formData.agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
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
    if (validate()) {
      try {
        await signup(formData.email, formData.password, formData.name);
        navigate("/otp-verification");
      } catch (err) {
        toast.error("Signup failed");
      }
    }
  };

  // Custom Google Login handler using useGoogleLogin
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Send the authorization code to the backend
        await loginWithGoogle(tokenResponse.code);
        navigate("/home");
      } catch (error) {
        toast.error("Google Sign-Up failed: " + (error.message || "Unknown error"));
      }
    },
    onError: (error) => {
      toast.error("Google Sign-Up failed: " + (error.message || "Unknown error"));
    },
    flow: "auth-code",
    redirect_uri: window.location.origin, // Must match Google Cloud Console
  });

  return (
    <motion.div
      className="signupPage"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>

      <motion.form
        className="form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <FaAngleLeft className="back-arrow" onClick={() => navigate(-1)} />
        <h1>
          Hello <span>There !!</span>
        </h1>
        <p>
          Have an account? <a href="/signin">Log In</a>
        </p>

        {/* Username Input */}
        <div className="phone-number-input username-input">
          <label>
            Username <span>*</span>
          </label>
          <input
            type="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {showMsg && errors.name && (
            <motion.p
              className="error-message"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {errors.name}
            </motion.p>
          )}
        </div>

        {/* Email Input */}
        <div className="email-input">
          <label>
            Email <span>*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {showMsg && errors.email && (
            <motion.p
              className="error-message"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {errors.email}
            </motion.p>
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
          {error && <p className="error-message text-center">{error}</p>}
          <button type="submit" className="registerButton" disabled={isLoading}>
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Register"
            )}
          </button>

          <motion.button
            type="button"
            className="googleButton"
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <>
              <img src={GoogleIcon} alt="Google" className="googleIcon" />
              Sign Up with Google
            </>
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
};

const SignupWithProvider = () => (
  <GoogleOAuthProvider clientId="301899233164-s87ofoj53j35cjkelodhnuvkjkuid2il.apps.googleusercontent.com">
    <Signup />
  </GoogleOAuthProvider>
);

export default SignupWithProvider;