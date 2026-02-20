import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development"
		? "http://localhost:8000/api"
		: "https://rent-up-api.vercel.app/api",
	withCredentials: true, // send cookies to the server
});

// Configure retry parameters
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

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

// Add response interceptor for retries and global error handling
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const { config, response } = error;

		// Only retry for GET requests to avoid side effects on POST/PUT/DELETE
		const isRetryableMethod = config && config.method === "get";

		// Retry on network errors (no response) or 5xx server errors
		const isRetryableError = !response || (response.status >= 500 && response.status <= 599);

		if (isRetryableMethod && isRetryableError) {
			config._retryCount = config._retryCount || 0;

			if (config._retryCount < MAX_RETRIES) {
				config._retryCount += 1;
				console.warn(`Retrying request (${config._retryCount}/${MAX_RETRIES}): ${config.url}`);

				// Exponential backoff or simple delay
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * config._retryCount));

				return axiosInstance(config);
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;

