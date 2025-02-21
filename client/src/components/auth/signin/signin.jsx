import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./signin.scss";
import { GoEye } from "react-icons/go";
import { FaRegEyeSlash, FaAngleLeft } from "react-icons/fa";
import GoogleIcon from "../../../../public/svg/google.svg"; // Ensure this path is correct
import Logo from "../../pics/logo.png";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const Signin = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, loginWithGoogle } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRememberMe = (e) => setRememberMe(e.target.checked);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      rememberMe
        ? localStorage.setItem("rememberedEmail", formData.email)
        : localStorage.removeItem("rememberedEmail");
      if (isAuthenticated) navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  // Custom Google Login handler using useGoogleLogin
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch ID token using the code (auth code flow)
        const response = await fetch(
          `https://oauth2.googleapis.com/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              code: tokenResponse.code,
              client_id: "301899233164-s87ofoj53j35cjkelodhnuvkjkuid2il.apps.googleusercontent.com",
              client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET, // Add to .env
              redirect_uri: window.location.origin,
              grant_type: "authorization_code",
            }),
          }
        );
        const { id_token } = await response.json();
        await loginWithGoogle(id_token);
        navigate("/home");
      } catch (error) {
        toast.error("Google Sign-In failed");
      }
    },
    onError: () => {
      toast.error("Google Sign-In failed");
    },
    flow: "auth-code", // Use auth-code flow to get a code, then exchange for ID token
  });

  return (
    <motion.div
      className="signinPage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="logo"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <img src={Logo} alt="Logo" />
      </motion.div>

      <motion.form
        className="form"
        onSubmit={handleSubmit}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      >
        <motion.div whileHover={{ scale: 1.05 }}>
          <FaAngleLeft className="back-arrow" onClick={() => navigate(-1)} />
        </motion.div>

        <h1>
          Welcome <span>Back !!</span>
        </h1>

        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>

        <motion.div
          className="email-input"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <label>
            Email <span>*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </motion.div>

        <motion.div
          className="confirm-password-input"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <label>Password</label>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
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
        </motion.div>

        <div className="remember-me">
          <div>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMe}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          <span>
            <a href="/forgot-password">Forgot password?</a>
          </span>
        </div>

        <div className="buttons">
          {error && (
            <motion.p
              className="error-message text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            className="registerButton"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Log In"
            )}
          </motion.button>

          {/* Custom Google Button */}
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
                Sign in with Google
              </>
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
};

// Wrap Signin with GoogleOAuthProvider
const SigninWithProvider = () => (
  <GoogleOAuthProvider clientId="301899233164-s87ofoj53j35cjkelodhnuvkjkuid2il.apps.googleusercontent.com">
    <Signin />
  </GoogleOAuthProvider>
);

export default SigninWithProvider;