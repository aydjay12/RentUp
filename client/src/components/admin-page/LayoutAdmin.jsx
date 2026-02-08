import { Outlet } from "react-router-dom";
import React from "react";
import Header from "../common/header/Header";
import Snackbar from "../common/Snackbar/Snackbar";
import useSnackbarStore from "../../store/useSnackbarStore";

const LayoutAdmin = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default LayoutAdmin;
