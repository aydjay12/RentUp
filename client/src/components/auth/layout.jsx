import { Outlet } from "react-router-dom";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LayoutAuth = () => {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        style={{ fontFamily: "Poppins, sans-serif" }}
      />
      <Outlet />
    </>
  );
};

export default LayoutAuth;
