import React, { useEffect } from "react";

const SuccessMessage = ({
  message, onClose, duration = 3000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  if (!message) return null;
  return (
    <div style={styles.container}>
      <div style={styles.message}>
        <span style={styles.icon}>✅</span>
        <span>{message}</span>
        <button onClick={onClose} style={styles.closeButton}>
          ✕
        </button>
      </div>
    </div>
  );
};









const styles = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
  },
  message: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    minWidth: '300px',
  },
  icon: {
    fontSize: '1.25rem',
  },
  closeButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    fontSize: '1.25rem',
    cursor: 'pointer',
    marginLeft: 'auto',
    padding: '0',
  },
};

export default SuccessMessage;