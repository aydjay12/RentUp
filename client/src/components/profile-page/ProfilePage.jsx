// ProfilePage.jsx
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ProfilePage.module.scss";
import { FaCamera, FaSave, FaSignOutAlt, FaEdit } from "react-icons/fa";
import ProfilePic from "../pics/default-profile.png";
import { Loader } from "lucide-react";
import { Modal, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, fetchProfile, updateProfile, uploadProfileImage, logout, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    birthday: "",
    lastLogin: "",
    image: ProfilePic,
    role: "", // Add role to formData
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(ProfilePic);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user) {
      const newFormData = {
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        gender: user.gender || "",
        birthday: user.birthday || "",
        lastLogin: user.lastLogin || "",
        image: user.image || ProfilePic,
        role: user.role || "user", // Default to "user" if role is not set
      };
      setFormData(newFormData);
      setPreviewImage(user.image || ProfilePic);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = { ...formData, name: formData.username };
      if (imageFile) {
        const imageUrl = await uploadProfileImage(imageFile);
        updatedData.image = imageUrl;
        setPreviewImage(imageUrl);
      }
      await updateProfile(updatedData);
      setIsEditing(false);
      setImageFile(null);
    } catch (error) {
      // Errors are handled in the store with toast notifications
    }
  };

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
    <motion.div
      className={styles.profilePage}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={styles.profileHeader}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1>Profile Dashboard</h1>
        <motion.button
          className={styles.logoutBtn}
          onClick={() => setLogoutModalOpen(true)}
          title="Logout"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          <FaSignOutAlt /> Sign Out
        </motion.button>
      </motion.div>
      <Modal
        opened={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Confirm Logout"
        centered
      >
        <p className={styles.confirmMessage}>Are you sure you want to log out?</p>
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

      <motion.div
        className={styles.profileCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className={styles.avatarSection}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className={styles.imageWrapper}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            key={previewImage}
          >
            <img src={previewImage} alt="Profile" className={styles.profileImage} />
            <AnimatePresence>
              {isEditing && (
                <motion.label
                  htmlFor="profileImageUpload"
                  className={styles.uploadOverlay}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <FaCamera />
                  <input
                    id="profileImageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                    disabled={isLoading}
                  />
                </motion.label>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.h2
            className={styles.userName}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            {formData.username || "Unnamed User"}
          </motion.h2>
          <motion.div
            className={styles.userRole}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {formData.role}
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.infoSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.infoGrid}>
            <motion.div
              className={styles.infoItem}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <label>Username</label>
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.input
                    key="username-input"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    disabled={isLoading}
                  />
                ) : (
                  <motion.div
                    key="username-value"
                    className={styles.infoValue}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formData.username || "Not set"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className={styles.infoItem}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              <label>Email</label>
              <div className={styles.infoValue}>{formData.email}</div>
            </motion.div>

            <motion.div
              className={styles.infoItem}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              <label>Phone</label>
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.input
                    key="phone-input"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    disabled={isLoading}
                  />
                ) : (
                  <motion.div
                    key="phone-value"
                    className={styles.infoValue}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formData.phone || "Not set"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className={styles.infoItem}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <label>Address</label>
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.input
                    key="address-input"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    disabled={isLoading}
                  />
                ) : (
                  <motion.div
                    key="address-value"
                    className={styles.infoValue}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formData.address || "Not set"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className={styles.infoItem}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.55 }}
            >
              <label>Gender</label>
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.select
                    key="gender-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    disabled={isLoading}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </motion.select>
                ) : (
                  <motion.div
                    key="gender-value"
                    className={styles.infoValue}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formData.gender || "Not set"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className={styles.infoItem}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <label>Birthday</label>
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.input
                    key="birthday-input"
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    disabled={isLoading}
                  />
                ) : (
                  <motion.div
                    key="birthday-value"
                    className={styles.infoValue}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formData.birthday ? new Date(formData.birthday).toLocaleDateString() : "Not set"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className={styles.infoItem}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.65 }}
            >
              <label>Last Login</label>
              <div className={styles.infoValue}>
                {formData.lastLogin ? new Date(formData.lastLogin).toLocaleString() : "N/A"}
              </div>
            </motion.div>
          </div>

          <motion.div
            className={styles.actionButtons}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <motion.button
              className={styles.actionBtn}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Loader className="w-6 h-6 animate-spin mx-auto" />
                  </motion.span>
                ) : isEditing ? (
                  <motion.span
                    key="save"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaSave /> Save Changes
                  </motion.span>
                ) : (
                  <motion.span
                    key="edit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaEdit /> Edit Profile
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;