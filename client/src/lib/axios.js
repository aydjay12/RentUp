import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development"
		? "http://localhost:8000/api"
		: "https://rent-up-server.vercel.app/api",
	withCredentials: true, // send cookies to the server
});

export default axiosInstance;
