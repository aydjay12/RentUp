import { Outlet } from "react-router-dom";
import React from "react";
import Header from "../common/header/Header";
import Snackbar from "../common/Snackbar/Snackbar";
import useSnackbarStore from "../../store/useSnackbarStore";

const LayoutAdmin = () => {
  const { isOpen, message, type, hideSnackbar } = useSnackbarStore();

  return (
    <>
      <Snackbar
        isOpen={isOpen}
        message={message}
        type={type}
        onClose={hideSnackbar}
      />
      <Header />
      <Outlet />
    </>
  );
};

export default LayoutAdmin;
