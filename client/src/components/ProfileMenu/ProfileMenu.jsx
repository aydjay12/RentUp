import React, { useState } from "react";
import { Avatar, Menu, Modal, Button, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import "@mantine/core/styles.css";
import styles from "./ProfileMenu.module.scss";
import { User, Heart, LogOut } from "lucide-react";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { user = {}, logout } = useAuthStore();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const avatarText = user?.username ? user.username.charAt(0).toUpperCase() : "?";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setLogoutModalOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <Menu shadow="md" width={200} transitionProps={{ transition: 'pop-top-right' }} position="bottom-end" zIndex={1001}>
        <Menu.Target>
          <div className="profile-menu">
            <Avatar
              src={user.image}
              alt="User"
              radius="xl"
              color="#27ae60"
              style={{ cursor: "pointer" }}
            >
              {!user.image && avatarText}
            </Avatar>
          </div>
        </Menu.Target>
        <Menu.Dropdown className={styles.dropdownMobile}>
          <Menu.Label>Account Settings</Menu.Label>
          <Menu.Item
            leftSection={<User size={16} />}
            onClick={() => navigate("/profile-page")}
          >
            My Profile
          </Menu.Item>
          <Menu.Item
            leftSection={<Heart size={16} />}
            onClick={() => navigate("/favourites")}
          >
            My Favourites
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            color="red"
            leftSection={<LogOut size={16} />}
            onClick={() => setLogoutModalOpen(true)}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Modal
        opened={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Confirm Logout"
        centered
        className={styles.modalPopup}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Text size="sm">
          Are you sure you want to log out of your account?
        </Text>
        <div className={styles.modalActions}>
          <Button
            className={isLoggingOut ? styles.confirmButton + " " + styles["logout-btn-no-hover"] : styles.confirmButton}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Yes, Logout"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setLogoutModalOpen(false)}
            disabled={isLoggingOut}
            className={isLoggingOut ? styles.cancelButton + " " + styles["cancel-btn-no-hover"] : styles.cancelButton}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ProfileMenu;
