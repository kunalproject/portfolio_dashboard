import { PortfolioContext } from "../../PortfolioContext.js";
import { useContext } from "react";
import React from 'react';
import styles from './Message.module.css';

const Message = () => {
  const { userData } = useContext(PortfolioContext);
  console.log("userData", userData);
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Safely get messages array
  const messages = userData?.messages ? [...userData.messages].reverse() : [];
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Messages</h2>
      {!userData || messages.length === 0 ? (
        <p className={styles.empty}>No messages to show</p>
      ) : (
        <div className={styles.list}>
          {messages.map((message, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.header}>
                <h3 className={styles.name}>{message.name || 'Anonymous'}</h3>
                <span className={styles.date}>
                  {message.date ? formatDate(message.date) : 'No date'}
                </span>
              </div>
              {message.mail && (
                <a href={`mailto:${message.mail}`} className={styles.email}>
                  {message.mail}
                </a>
              )}
              <p className={styles.content}>{message.msg || 'No message content'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Message;