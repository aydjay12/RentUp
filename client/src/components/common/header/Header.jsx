import React, { useState, useEffect } from "react";
import "./header.css";
import { nav } from "../../data/Data";
import { Link, NavLink, useLocation } from "react-router-dom"; // Import useLocation
import { useAuth0 } from "@auth0/auth0-react";
import ProfileMenu from "../../ProfileMenu/ProfileMenu";
import Logo from "../../pics/logo.png";
import { FaBars, FaSignOutAlt, FaTimes } from "react-icons/fa";

const Header = () => {
  const [navList, setNavList] = useState(false);
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();
  const location = useLocation(); // Get the current location

  // Reset navList to false when the route changes
  useEffect(() => {
    setNavList(false);
  }, [location]); // Trigger effect when location changes

  return (
    <>
      <header>
        <div className="container flex">
          <Link to="/" className="logo">
            <img src={Logo} alt="" />
          </Link>
          <div className="nav">
            <ul className={navList ? "small" : "flex"}>
              {nav.map((list, index) => (
                <li key={index}>
                  <NavLink to={list.path}>{list.text}</NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex list">
            {!isAuthenticated ? (
              <button className="btn1 sign-in" onClick={loginWithRedirect}>
                <FaSignOutAlt /> Sign In
              </button>
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
      </header>
    </>
  );
};

export default Header;