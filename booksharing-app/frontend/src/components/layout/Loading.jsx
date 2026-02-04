import React from "react";

const Loading = ({ text = 'Loading...' }) => {
  return (
    <div style={styles.container}>
      <div style={styles.spinnerContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.text}>{text}</p>
      </div>
    </div>
  );
};


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1rem',
    minHeight: '400px',
  },
  spinnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
  },
  text: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
  },
};

export default Loading;