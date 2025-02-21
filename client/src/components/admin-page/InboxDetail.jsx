import styles from "./Inbox.module.scss";

const InboxDetail = ({ message }) => {
  if (!message) return <div>No message selected</div>;

  return (
    <div className={styles.inboxDetailContainer}>
      <h2>{message.subject}</h2>
      <p>
        <strong>Name:</strong> {message.name}
      </p>
      <p>
        <strong>Email:</strong> {message.email}
      </p>
      <div className={styles.messageBody}>
        <h3>Message:</h3>
        <p>{message.body}</p>
      </div>
    </div>
  );
};

export default InboxDetail;