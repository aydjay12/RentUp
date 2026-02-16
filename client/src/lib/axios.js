import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development"
		? "http://localhost:8000/api"
		: "https://rent-up-api.vercel.app/api",
	withCredentials: true, // send cookies to the server
});

// Add request interceptor to include token in Authorization header (for iOS/cross-origin compatibility)
axiosInstance.interceptors.request.use(
	(config) => {
		try {
			const token = localStorage.getItem("auth_token");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		} catch (error) {
			console.error("Failed to get token from localStorage:", error);
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
