import React from "react";
import { Avatar, Menu } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import "@mantine/core/styles.css";
import { useState } from "react";
import { Modal, Button } from "@mantine/core";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { user = {}, logout } = useAuthStore(); // Ensure user is always an object
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Extract the first letter of the user's name (fallback if no image)
  const avatarText = user?.name ? user.name.charAt(0).toUpperCase() : "?";

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
            src={user.picture} // If user has a picture, use it
            alt="User Image"
            radius="xl"
            color="#27ae60" // Background color for text avatar
          >
            {!user.picture && avatarText} {/* Show first letter if no picture */}
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
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1em" }}>
          <Button color="red" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out" : "Yes, Logout"}
          </Button>
          <Button variant="outline" onClick={() => setLogoutModalOpen(false)} disabled={isLoggingOut}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ProfileMenu;
