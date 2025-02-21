import React from "react";
import { Avatar, Menu } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import "@mantine/core/styles.css";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { user = {}, logout } = useAuthStore(); // Ensure user is always an object

  // Extract the first letter of the user's name (fallback if no image)
  const avatarText = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
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
        <Menu.Item
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
