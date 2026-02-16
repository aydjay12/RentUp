import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Trash, User, Mail as MailIcon, Calendar, Clock } from "lucide-react";
import { useContactStore } from "../../store/useContactStore";
import { Modal, Button, Text } from "@mantine/core";
import styles from "./Inbox.module.scss";
import { PuffLoader } from "react-spinners";

const Inbox = () => {
  const { contacts, getAllContacts, deleteContact, loading, mutationLoading, error } = useContactStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [opened, setOpened] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 8;
  const messageId = searchParams.get("messageId");

  useEffect(() => {
    getAllContacts();
  }, []);

  useEffect(() => {
    if (messageId && contacts.length > 0) {
      const msg = contacts.find((c) => c._id === messageId);
      if (msg) setSelectedMessage(msg);
    } else {
      setSelectedMessage(null);
    }
  }, [messageId, contacts]);

  if (loading) {
    return (
      <div className="admin-loading-container">
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-loading-container" style={{ flexDirection: 'column', padding: '3rem' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ margin: '0 auto 1.5rem' }}>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 600 }}>Failed to Load</h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-light)', marginBottom: '2rem', textAlign: 'center' }}>{error || 'Unable to fetch inbox messages.'}</p>
        <button className="admin-confirm-button" onClick={() => getAllContacts()}>Retry</button>
      </div>
    );
  }

  const filteredMessages = contacts.filter((message) =>
    [message.subject, message.name, message.email].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSelectMessage = (message) => {
    setSearchParams({ messageId: message._id });
  };

  const confirmDeleteMessage = (mid) => {
    setMessageToDelete(mid);
    setOpened(true);
  };

  const handleDeleteMessage = async () => {
    if (messageToDelete) {
      await deleteContact(messageToDelete);
      if (selectedMessage?._id === messageToDelete) {
        setSearchParams({});
      }
      setOpened(false);
    }
  };

  const goBackToInbox = () => {
    setSearchParams({});
  };

  return (
    <div className={styles.inboxContainer}>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Confirm Delete"
        centered
        className={styles.modalPopup}
        zIndex={3000}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Text size="sm">
          Are you sure you want to delete this message? This action cannot be undone.
        </Text>
        <div className={styles.modalActions}>
          <Button
            className={`${styles.confirmButton} ${mutationLoading ? styles["remove-btn-no-hover"] : ""}`}
            onClick={handleDeleteMessage}
            disabled={mutationLoading}
          >
            {mutationLoading ? "Deleting..." : "Yes, Delete"}
          </Button>
          <Button
            className={`${styles.cancelButton} ${mutationLoading ? styles["cancel-btn-no-hover"] : ""}`}
            variant="white"
            onClick={() => setOpened(false)}
            disabled={mutationLoading}
          >
            No, Cancel
          </Button>
        </div>
      </Modal>

      {selectedMessage ? (
        <motion.div
          key="messageDetail"
          className={styles.inboxDetailContainer}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className={styles.detailHeader}>
            <div className={styles.headerLeft}>
              <button className={styles.backButton} onClick={goBackToInbox}>
                <ArrowLeft size={20} />
              </button>
              <div className={styles.headerInfo}>
                <h3>Message Details</h3>
                <p>Received on {new Date(selectedMessage.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <button
              className={styles.detailDeleteBtn}
              onClick={() => confirmDeleteMessage(selectedMessage._id)}
            >
              <Trash size={18} />
              <span>Delete Message</span>
            </button>
          </div>

          <div className={styles.messageContent}>
            <div className={styles.contentSidebar}>
              <div className={styles.senderAvatar}>
                {selectedMessage.name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.sidebarDetails}>
                <div className={styles.detailItem}>
                  <User size={16} />
                  <span>{selectedMessage.name}</span>
                </div>
                <div className={styles.detailItem}>
                  <MailIcon size={16} />
                  <span>{selectedMessage.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <Calendar size={16} />
                  <span>{new Date(selectedMessage.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={styles.detailItem}>
                  <Clock size={16} />
                  <span>{new Date(selectedMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            <div className={styles.contentMain}>
              <div className={styles.subjectWrapper}>
                <span className={styles.subjectLabel}>Subject</span>
                <h1 className={styles.messageSubject}>{selectedMessage.subject}</h1>
              </div>
              <div className={styles.bodyWrapper}>
                <span className={styles.bodyLabel}>Message</span>
                <div className={styles.messageBody}>
                  {selectedMessage.message}
                </div>
              </div>

              <div className={styles.replyWrapper}>
                <button
                  className={styles.replyButton}
                  onClick={() => {
                    const subject = encodeURIComponent(`Re: ${selectedMessage.subject}`);
                    const body = encodeURIComponent(`\n\n--- Original Message ---\nFrom: ${selectedMessage.name}\nSubject: ${selectedMessage.subject}\n\n${selectedMessage.message}`);
                    window.location.href = `mailto:${selectedMessage.email}?subject=${subject}&body=${body}`;
                  }}
                >
                  <MailIcon size={18} />
                  <span>Reply via Email</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="inboxList"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.listWrapper}
        >
          <div className={styles.listHeader}>
            <div className={styles.searchContainer}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.messageCount}>
              Total Messages: <strong>{filteredMessages.length}</strong>
            </div>
          </div>

          <div className={styles.inboxListContainer}>
            {filteredMessages.length > 0 ? (
              <>
                <table className={styles.inboxTable}>
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th className={styles.subjectHeader}>Subject</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {currentMessages.map((message) => (
                        <motion.tr
                          key={message._id}
                          layout
                          onClick={() => handleSelectMessage(message)}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                        >
                          <td>
                            <div className={styles.senderCell}>
                              <div className={styles.tinyAvatar}>
                                {message.name.charAt(0).toUpperCase()}
                              </div>
                              <span>{message.name}</span>
                            </div>
                          </td>
                          <td className={styles.subjectCell}>{message.subject}</td>
                          <td className={styles.dateCell}>
                            {new Date(message.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDeleteMessage(message._id);
                              }}
                              className={styles.rowDeleteBtn}
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>

                {filteredMessages.length > messagesPerPage && (
                  <div className={styles.pagination}>
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                      Previous
                    </button>
                    <span>Page {currentPage} of {Math.ceil(filteredMessages.length / messagesPerPage)}</span>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={indexOfLastMessage >= filteredMessages.length}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.noMessages}>
                <p>No messages found in your inbox.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Inbox;
