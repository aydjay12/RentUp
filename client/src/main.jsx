import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="dev-ee4hguujf503yj1e.us.auth0.com"
    clientId="xYdNUBf6SmLUq5KKDohHmTP8dE8mzWtc"
    authorizationParams={{
      redirect_uri: "https://rent-up-gold.vercel.app",
    }}
    audience="http://localhost:8000"
    scope="openid profile email"
    cacheLocation="localstorage"
  >
    <App />
  </Auth0Provider>
);
