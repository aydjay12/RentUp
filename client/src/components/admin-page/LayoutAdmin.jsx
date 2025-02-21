import { Outlet } from "react-router-dom";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../common/header/Header";

const LayoutAdmin = () => {
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
      <Header />
      <Outlet />
    </>
  );
};

export default LayoutAdmin;
