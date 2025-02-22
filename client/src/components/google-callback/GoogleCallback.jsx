import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";
import { PuffLoader } from "react-spinners";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          await loginWithGoogle(code);
          navigate("/home");
        } catch (error) {
          toast.error(
            "Google Sign-In failed: " + (error.message || "Unknown error")
          );
          navigate("/signin");
        }
      } else {
        toast.error("Authorization code not found");
        navigate("/signin");
      }
    };

    handleCallback();
  }, [location, loginWithGoogle, navigate]);

  return (
    <div className="wrapper flexCenter" style={{ minHeight: "100vh" }}>
      <PuffLoader color="#27ae60" aria-label="puff-loading" />
    </div>
  ); // Show a loading state while processing
};

export default GoogleCallback;
