import React, { useState, useEffect } from "react";
import "./header.css";
import { nav } from "../../data/Data";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import ProfileMenu from "../../ProfileMenu/ProfileMenu";
import Logo from "../../pics/logo.png";
import { ShoppingCart } from "lucide-react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useCartStore } from "../../../store/useCartStore";
import { Menu, Button } from "@mantine/core";

const Header = () => {
  const navigate = useNavigate();
  const [navList, setNavList] = useState(false); // Tracks menu open/close state
  const location = useLocation();
  const { cartItems, fetchCart } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const isAdmin = user?.role === "admin";

  // Close menu on route change
  useEffect(() => {
    setNavList(false);
  }, [location]);

  // Handle menu toggle state change
  const handleMenuToggle = (opened) => {
    setNavList(opened);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 10 }}
    >
      <div className="container flex">
        <Link to="/" className="logo">
          <img src={Logo} alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <div className="nav">
          <ul className="flex">
            {nav.map((list, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <NavLink
                  to={list.path}
                  className={({ isActive }) =>
                    isActive && !location.pathname.match(/^\/properties\/[a-zA-Z0-9]+$/) ? "active" : ""
                  }
                >
                  {list.text}
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right Section: Auth or User Controls */}
        <div className="flex list">
          {!isAuthenticated ? (
            <div className="auth-buttons">
              <motion.button
                className="btn1 sign-in"
                onClick={() => navigate("/signin", { state: { from: location } })}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Log In
              </motion.button>
              <motion.button
                className="btn1 sign-in sign-up"
                onClick={() => navigate("/signup", { state: { from: location } })}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Sign Up
              </motion.button>
            </div>
          ) : (
            <div className="authenticated-header">
              <div className="desktop-quick-links">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <NavLink to="/cart" className="quick-link">Cart ({cartItems.length})</NavLink>
                </motion.div>
                {isAdmin && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <NavLink to="/admin-dashboard" className="quick-link admin-link">Admin</NavLink>
                  </motion.div>
                )}
              </div>
              <div className="toggle-v2">
                <Menu
                  shadow="md"
                  width={200}
                  opened={navList}
                  onChange={handleMenuToggle}
                  offset={15}
                  zIndex={1001}
                  position="bottom-end"
                  transitionProps={{ transition: 'pop-top-right' }}
                >
                  <Menu.Target>
                    <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                      {navList ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </div>
                  </Menu.Target>

                  <Menu.Dropdown className="dropdown-mobile">
                    <Menu.Label>Menu</Menu.Label>
                    {nav.map((list, index) => (
                      <Menu.Item
                        key={index}
                        component={NavLink}
                        to={list.path}
                      >
                        {list.text}
                      </Menu.Item>
                    ))}
                    <Menu.Divider />
                    <Menu.Label>Quick Actions</Menu.Label>
                    <Menu.Item component={NavLink} to="/cart">
                      Cart ({cartItems.length})
                    </Menu.Item>
                    {isAdmin && (
                      <Menu.Item
                        component={NavLink}
                        to="/admin-dashboard"
                        color="#27ae60"
                      >
                        Admin Dashboard
                      </Menu.Item>
                    )}
                  </Menu.Dropdown>
                </Menu>
              </div>
              <ProfileMenu user={user} logout={logout} />
            </div>
          )}
        </div>

        {/* Mobile-only toggle for guest users */}
        {!isAuthenticated && (
          <div className="toggle">
            <Menu
              shadow="md"
              width={200}
              opened={navList}
              onChange={handleMenuToggle}
              offset={20}
              zIndex={1001}
              position="bottom-end"
              transitionProps={{ transition: 'pop-top-right' }}
            >
              <Menu.Target>
                <div style={{ cursor: "pointer" }}>
                  {navList ? <FaTimes size={20} /> : <FaBars size={20} />}
                </div>
              </Menu.Target>

              <Menu.Dropdown className="dropdown-mobile">
                <Menu.Label>Menu</Menu.Label>
                {nav.map((list, index) => (
                  <Menu.Item key={index} component={NavLink} to={list.path}>
                    {list.text}
                  </Menu.Item>
                ))}
                <Menu.Divider />
                <Menu.Label>Account</Menu.Label>
                <Menu.Item component={NavLink} to="/signin" state={{ from: location }}>
                  Log In
                </Menu.Item>
                <Menu.Item component={NavLink} to="/signup" state={{ from: location }} color="#27ae60">
                  Sign Up
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;