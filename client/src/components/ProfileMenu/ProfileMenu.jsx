import React from "react";
import { Avatar, Menu } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import "@mantine/core/styles.css";
import { useState } from "react";
import { Modal, Button } from "@mantine/core";
import "../profile-page/ProfilePage.module.scss";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { user = {}, logout } = useAuthStore(); // Ensure user is always an object
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Extract the first letter of the user's username (fallback if no image)
  const avatarText = user?.username ? user.username.charAt(0).toUpperCase() : "?";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setLogoutModalOpen(false);
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <Menu className="profile-menu">
        <Menu.Target>
          <Avatar
            src={user.image} // If user has a picture, use it
            alt="User Image"
            radius="xl"
            color="#27ae60" // Background color for text avatar
          >
            {!user.image && avatarText} {/* Show first letter if no picture */}
          </Avatar>
        </Menu.Target>
        <Menu.Dropdown className="dropdown">
          <Menu.Item onClick={() => navigate("/favourites")}>My Favourites</Menu.Item>
          <Menu.Item onClick={() => navigate("/profile-page")}>Profile</Menu.Item>
          <Menu.Item onClick={() => setLogoutModalOpen(true)}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal
        opened={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Confirm Logout"
        centered
      >
        <p>Are you sure you want to log out?</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1em", marginTop: 15 }}>
          <Button
            color="red"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={isLoggingOut ? "logout-btn-no-hover" : ""}
          >
            {isLoggingOut ? "Logging out" : "Yes, Logout"}
          </Button>
          <Button variant="outline" onClick={() => setLogoutModalOpen(false)} disabled={isLoggingOut} className={isLoggingOut ? "cancel-btn-no-hover" : ""}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ProfileMenu;
