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
      fetchAllResidencies(); // Refresh the list
    } catch (error) {
      console.error("Error updating residency:", error);
    }
  };

  return (
    <motion.div
      className={styles.residenciesList}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Mantine Delete Confirmation Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Confirm Deletion"
        centered
        className={styles.modalPopup}
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
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <CreateResidencyForm
          residency={selectedResidency}
          onSave={handleSaveEdit}
          isEditMode={true}
        />
      </Modal>

      {loading ? (
        <div className="wrapper flexCenter" style={{ height: "60vh" }}>
          <PuffLoader color="#27ae60" aria-label="puff-loading" />
        </div>
      ) : residencies.length === 0 ? (
        <p className={styles.noResidencies}>No residencies available</p>
      ) : (
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
                <td className={styles.residencyCell}>
                  <img
                    className={styles.residencyImage}
                    src={residency.image}
                    alt={residency.title}
                  />
                  <span>{residency.title}</span>
                </td>
                <td>
                  {residency.address}, {residency.city}, {residency.country}
                </td>
                <td>${residency.price}.00</td>
                <td>{residency.type}</td>
                <td>{residency.status}</td>
                <td className={styles.actions}>
                  <button
                    onClick={() => handleEditClick(residency)}
                    className={styles.actionButton}
                  >
                    <Edit className={styles.editButton} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(residency)}
                    className={styles.actionButton}
                  >
                    <Trash className={styles.trashIcon} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default ResidenciesList;
