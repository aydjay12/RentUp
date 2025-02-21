import Header from "../common/header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../common/footer/Footer";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
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
      <Footer />
    </>
  );
};

export default Layout;
