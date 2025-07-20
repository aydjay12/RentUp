import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:8000/api"
    : "https://rentupgold.onrender.com/api",
});

export default axios;