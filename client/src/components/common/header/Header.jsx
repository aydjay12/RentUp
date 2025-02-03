import React, { useState, useEffect } from "react";
import "./header.css";
import { nav } from "../../data/Data";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileMenu from "../../ProfileMenu/ProfileMenu";
import Logo from "../../pics/logo.png";
import { FaBars, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const Header = () => {
  const [navList, setNavList] = useState(false);
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();
  const location = useLocation();

  useEffect(() => {
    setNavList(false);
  }, [location]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 10 }}
    >
      <div className="container flex">
        <Link to="/" className="logo">
          <img src={Logo} alt="" />
        </Link>
        <div className="nav">
          <ul className={navList ? "small" : "flex"}>
            {nav.map((list, index) => (
              <motion.li 
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <NavLink to={list.path}>{list.text}</NavLink>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="flex list">
          {!isAuthenticated ? (
            <motion.button
              className="btn1 sign-in"
              onClick={loginWithRedirect}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaSignOutAlt /> Sign In
            </motion.button>
          ) : (
            <ProfileMenu user={user} logout={logout} />
          )}
        </div>
        <div className="toggle">
          <button onClick={() => setNavList(!navList)}>
            {navList ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
