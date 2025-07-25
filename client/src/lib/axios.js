import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development"
		? "http://localhost:8000/api"
		: "https://rentupgold.onrender.com/api",
	withCredentials: true, // send cookies to the server
});

export default axiosInstance;
