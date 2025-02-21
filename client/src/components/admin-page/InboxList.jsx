import { useState } from "react";
import { Trash, Search } from "lucide-react";
import styles from "./Inbox.module.scss";

const InboxList = ({ inboxMessages, onSelectMessage, onDeleteMessage }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMessages = inboxMessages.filter((message) =>
    message.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.inboxListContainer}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <Search className={styles.searchIcon} />
      </div>

      <table className={styles.inboxTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMessages.map((message) => (
            <tr key={message.id} onClick={() => onSelectMessage(message)}>
              <td>{message.name}</td>
              <td>{message.email}</td>
              <td>{message.subject}</td>
              <td>{message.time}</td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMessage(message.id);
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
    </div>
  );
};

export default InboxList;