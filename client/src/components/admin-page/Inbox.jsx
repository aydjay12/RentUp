import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Trash } from "lucide-react";
import { useContactStore } from "../../store/useContactStore";
import { Modal, Button, Text } from "@mantine/core";
import styles from "./Inbox.module.scss";
import { PuffLoader } from "react-spinners";

const Inbox = () => {
  const { contacts, getAllContacts, deleteContact, loading } = useContactStore();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [opened, setOpened] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 8;

  useEffect(() => {
    getAllContacts();
  }, []);

  if (loading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );
  }

  // Filter messages based on search query
  const filteredMessages = contacts.filter((message) =>
    [message.subject, message.name, message.email].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination logic
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  const confirmDeleteMessage = (messageId) => {
    setMessageToDelete(messageId);
    setOpened(true);
  };

  const handleDeleteMessage = async () => {
    if (messageToDelete) {
      await deleteContact(messageToDelete);
      setSelectedMessage(null);
      setOpened(false);
    }
  };

  const goBackToInbox = () => {
    setSelectedMessage(null);
  };

  return (
    <motion.div key="inbox" {...tabMotion} className={styles.inboxContainer}>
      {/* Mantine Delete Confirmation Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Confirm Delete"
        centered
        className={styles.modalPopup}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Text size="sm">
          Are you sure you want to delete this message? This action cannot be undone.
        </Text>
        <div className={styles.modalActions}>
          <Button color="red" onClick={handleDeleteMessage} className={styles.confirmButton}>
            Yes, Delete
          </Button>
          <Button variant="outline" onClick={() => setOpened(false)} className={styles.cancelButton}>
            No, Cancel
          </Button>
        </div>
      </Modal>

      {selectedMessage ? (
        <motion.div
          key="messageDetail"
          className={styles.inboxDetailContainer}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.inboxHeader}>
            <button className={styles.backButton} onClick={goBackToInbox}>
              <ArrowLeft />
            </button>
            <p>{selectedMessage.name}</p>
            <button
              className={styles.deleteButton}
              onClick={() => confirmDeleteMessage(selectedMessage._id)}
            >
              <Trash />
            </button>
          </div>

          <h2>{selectedMessage.subject}</h2>
          <p>
            <strong>Email:</strong> {selectedMessage.email}
          </p>

          <div className={styles.messageBody}>
            <h3>Message:</h3>
            <p>{selectedMessage.message}</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="inboxList"
          className={styles.inboxListContainer}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.searchContainer}>
            <Search />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {filteredMessages.length > 0 ? (
            <>
              <table className={styles.inboxTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMessages.map((message) => (
                    <tr key={message._id} onClick={() => handleSelectMessage(message)}>
                      <td>{message.name}</td>
                      <td>{message.email}</td>
                      <td>{message.subject}</td>
                      <td>{new Date(message.createdAt).toLocaleString()}</td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteMessage(message._id);
                          }}
                          className={styles.deleteButton}
                        >
                          <Trash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className={styles.pagination}>
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                  Prev
                </button>
                <span>Page {currentPage}</span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={indexOfLastMessage >= filteredMessages.length}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className={styles.noMessages}>No Messages Found</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// Animation Config
const tabMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 },
};

export default Inbox;
