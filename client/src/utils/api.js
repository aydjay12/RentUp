import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:8000/api"
    : "https://rent-up-server.vercel.app/api",
});

export default axios;