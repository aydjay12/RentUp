import Header from "../common/header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../common/footer/Footer";
import React from "react";
import Snackbar from "../common/Snackbar/Snackbar";
import useSnackbarStore from "../../store/useSnackbarStore";

const Layout = () => {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
