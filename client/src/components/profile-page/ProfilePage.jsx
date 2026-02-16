// ProfilePage.jsx
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaSave, FaSignOutAlt, FaEdit } from "react-icons/fa";
import ProfilePic from "../pics/default-profile.png";
import { Loader } from "lucide-react";
import { Modal, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import "../../styles/profile-page.css";

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
    image: ProfilePic,
    role: "",
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
        image: user.image || ProfilePic,
        role: user.role || "user",
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
      className="profile-page-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-container">
        <motion.div
          className="profile-header-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="profile-header-title">Profile Dashboard</h1>
          <motion.button
            className="profile-logout-btn"
            onClick={() => setLogoutModalOpen(true)}
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
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
        >
          <p className="profile-confirm-message">
            Are you sure you want to log out of your account?
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1em", marginTop: 15 }}>
            <Button
              className="profile-modal-btn profile-modal-btn-confirm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              style={{ pointerEvents: isLoggingOut ? 'none' : 'auto' }}
            >
              {isLoggingOut ? "Logging out..." : "Yes, Logout"}
            </Button>
            <Button
              className="profile-modal-btn profile-modal-btn-cancel"
              onClick={() => setLogoutModalOpen(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
          </div>
        </Modal>

        <motion.div
          className="profile-main-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="profile-content-grid">
            <motion.div
              className="profile-avatar-section"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                className="profile-image-wrapper"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                key={previewImage}
              >
                <img src={previewImage} alt="Profile" className="profile-avatar-image" />
                <AnimatePresence>
                  {isEditing && (
                    <motion.label
                      htmlFor="profileImageUpload"
                      className="profile-upload-overlay"
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
                        className="profile-file-input"
                        disabled={isLoading}
                      />
                    </motion.label>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.h2
                className="profile-user-name"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                {formData.username || "Unnamed User"}
              </motion.h2>
              <motion.div
                className="profile-user-role"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                {formData.role}
              </motion.div>
            </motion.div>

            <motion.div
              className="profile-info-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="profile-info-grid">
                <motion.div
                  className="profile-info-item"
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
                        className="profile-info-value"
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
                  className="profile-info-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 }}
                >
                  <label>Email</label>
                  <div className="profile-info-value">{formData.email}</div>
                </motion.div>

                <motion.div
                  className="profile-info-item"
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
                        className="profile-info-value"
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
                  className="profile-info-item"
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
                        className="profile-info-value"
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
                  className="profile-info-item"
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
                        className="profile-info-value"
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
                  className="profile-info-item"
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
                        className="profile-info-value"
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


              </div>

              <motion.div
                className="profile-action-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <motion.button
                  className="profile-action-btn"
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
                        <Loader className="profile-spinner" size={20} />
                      </motion.span>
                    ) : isEditing ? (
                      <motion.span
                        key="save"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
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
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <FaEdit /> Edit Profile
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;