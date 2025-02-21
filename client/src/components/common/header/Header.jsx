import React, { useState, useEffect } from "react";
import "./header.css";
import { nav } from "../../data/Data";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore"; // Import Zustand store
import ProfileMenu from "../../ProfileMenu/ProfileMenu";
import Logo from "../../pics/logo.png";
import { ShoppingCart } from "lucide-react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useCartStore } from "../../../store/useCartStore";
import { Menu, Button } from "@mantine/core";

const Header = () => {
  const navigate = useNavigate();
  const [navList, setNavList] = useState(false);
  const location = useLocation();
  const { cartItems, fetchCart } = useCartStore(); // ✅ Fetch cart on mount

  // useEffect(() => {
  //   fetchCart(); // ✅ Load cart data on mount
  // }, [fetchCart]);

  // Get authentication state from authStore
  const { isAuthenticated, user, logout } = useAuthStore();
  const isAdmin = user?.role === "admin";

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
          <img src={Logo} alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <div className="nav">
          <ul className="flex">
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

        {/* Right Section: Cart & Profile */}
        <div className="flex list">
          {!isAuthenticated ? (
            <div className="auth-buttons">
              <motion.button
                className="btn1 sign-in"
                onClick={() => navigate("/signin")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Log In
              </motion.button>
              <motion.button
                className="btn1 sign-in sign-up"
                onClick={() => navigate("/signup")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Sign Up
              </motion.button>
            </div>
          ) : (
            <div className="authenticated-header">
              {isAdmin && (
                <ul>
                  <motion.li
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Link to="/admin-dashboard" className="admin-dashboard">
                      Admin Dashboard
                    </Link>
                  </motion.li>
                </ul>
              )}
              <Link to={"/cart"} className="cart-link">
                <ShoppingCart className="cart-icon" size={24} />
                <p className="cart-count">{cartItems.length}</p>
              </Link>
              <ProfileMenu user={user} logout={logout} />
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="toggle">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle">
                {navList ? <FaTimes size={20} /> : <FaBars size={20} />}
              </Button>
            </Menu.Target>

            <Menu.Dropdown className="dropdown-mobile">
              {nav.map((list, index) => (
                <Menu.Item key={index} component={NavLink} to={list.path}>
                  {list.text}
                </Menu.Item>
              ))}

              {isAdmin && isAuthenticated && (
                <Menu.Item
                  component={NavLink}
                  to="/admin-dashboard"
                  color="red"
                >
                  Admin Dashboard
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
