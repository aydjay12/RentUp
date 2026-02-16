import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash } from "lucide-react";
import { useResidencyStore } from "../../store/useResidencyStore";
import { PuffLoader } from "react-spinners";
import { Modal, Button, Text } from "@mantine/core";
import styles from "./ResidenciesList.module.scss";
import CreateResidencyForm from "./CreateResidencyForm";

const ResidenciesList = () => {
  const {
    residencies,
    fetchAllResidencies,
    removeResidency,
    loading,
    isError,
    error,
    updateResidency,
  } = useResidencyStore();

  const [openedDelete, setOpenedDelete] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(false);
  const [opened, setOpened] = useState(false);
  const [selectedResidency, setSelectedResidency] = useState(null);

  useEffect(() => {
    fetchAllResidencies(); // Fetch residencies when the component mounts
  }, []);

  const handleEditClick = (residency) => {
    setSelectedResidency(residency);
    setOpenedEdit(true);
  };

  const handleDeleteClick = (residency) => {
    setSelectedResidency(residency);
    setOpened(true);
  };

  const confirmDelete = () => {
    if (selectedResidency) {
      removeResidency(selectedResidency._id);
      setOpened(false);
      setSelectedResidency(null);
    }
  };

  const handleSaveEdit = async (updatedResidency) => {
    try {
      await updateResidency(selectedResidency._id, updatedResidency);
      setOpenedEdit(false);
      setSelectedResidency(null);
      // No need to explicitly call fetchAllResidencies() as updateResidency now updates the store's state directly
    } catch (error) {
      console.error("Error updating residency:", error);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-container">
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="admin-loading-container" style={{ flexDirection: 'column', padding: '3rem' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ margin: '0 auto 1.5rem' }}>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 600 }}>Failed to Load</h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-light)', marginBottom: '2rem', textAlign: 'center' }}>{error || 'Unable to fetch residencies list.'}</p>
        <button className="admin-confirm-button" onClick={() => fetchAllResidencies()}>Retry</button>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.residenciesListContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Mantine Delete Confirmation Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Confirm Deletion"
        centered
        className={styles.modalPopup}
        zIndex={3000}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Text size="sm">
          Are you sure you want to delete{" "}
          <strong>{selectedResidency?.title}</strong>? This action cannot be
          undone.
        </Text>
        <div className={styles.modalActions}>
          <Button
            color="red"
            onClick={confirmDelete}
            className={styles.confirmButton}
          >
            Yes, Delete
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpened(false)}
            className={styles.cancelButton}
          >
            No, Cancel
          </Button>
        </div>
      </Modal>

      {/* Mantine Edit Modal */}
      <Modal
        opened={openedEdit}
        onClose={() => setOpenedEdit(false)}
        title="Edit Residency"
        size="lg"
        centered
        className={styles.editPopup}
        zIndex={3000}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <CreateResidencyForm
          residency={selectedResidency}
          onSave={handleSaveEdit}
          isEditMode={true}
          inModal={true}
        />
      </Modal>

      {residencies.length === 0 ? (
        <div className={styles.noResidencies}>
          <p>No listings found in your database.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Residency</th>
                <th>Location</th>
                <th>Price</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {residencies.map((residency) => (
                <tr key={residency._id}>
                  <td>
                    <div className={styles.residencyCell}>
                      <img
                        className={styles.residencyImage}
                        src={residency.image}
                        alt={residency.title}
                      />
                      <div>
                        <span>{residency.title}</span>
                        <small>{residency.type}</small>
                      </div>
                    </div>
                  </td>
                  <td data-label="Location">
                    {residency.city}, {residency.country}
                  </td>
                  <td data-label="Price" className={styles.price}>
                    ${residency.price?.toLocaleString()}
                  </td>
                  <td data-label="Type">
                    {residency.type}
                  </td>
                  <td data-label="Status">
                    <span className={`${styles.statusBadge} ${styles[residency.status?.toLowerCase() || 'available']}`}>
                      {residency.status || 'Available'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEditClick(residency)}
                        className={`${styles.actionButton} ${styles.edit}`}
                        title="Edit Residency"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(residency)}
                        className={`${styles.actionButton} ${styles.delete}`}
                        title="Delete Residency"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default ResidenciesList;
