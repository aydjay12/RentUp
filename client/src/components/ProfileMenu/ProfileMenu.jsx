import React from "react";
import { MantineProvider, Avatar, Menu } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import "@mantine/core/styles.css";

const ProfileMenu = ({ user, logout }) => {
  const navigate = useNavigate();

  return (
    <MantineProvider>
      <Menu className="profile-menu">
        <Menu.Target>
          <Avatar
            src={user?.picture || "https://via.placeholder.com/150"}
            alt="user image"
            radius="xl"
          />
        </Menu.Target>
        <Menu.Dropdown className="dropdown">
          <Menu.Item onClick={() => navigate("/favourites", { replace: true })}>
            My Favourites
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              localStorage.removeItem("authToken"); // Clear specific keys
              logout();
            }}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </MantineProvider>
  );
};

export default ProfileMenu;
