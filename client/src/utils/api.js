import axios from "axios";

export const api = axios.create({
  baseURL: "https://rent-up-servers.vercel.app/api",
});

export default axios;