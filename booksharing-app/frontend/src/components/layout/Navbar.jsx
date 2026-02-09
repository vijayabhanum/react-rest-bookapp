import React from "react";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          📚 Book Sharing
        </Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link} >
            Books
          </Link>
          <Link to="/authors" style={styles.link} >
            Authors
          </Link>
          <Link to="/add-book" style={styles.link} >
            Add Book
          </Link>

          {isLoggedIn ? (
            <button onClick={handleLogout}
              style={styles.handleLogout}>
              Logout
              </button>
          ) : (
              <Link to='/login'>
                Login
              </Link>
          )}

        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#2c3e50',
    padding: '1rem 0',
    marginBottom: '2rem',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: 'white',
    fontSize: '1.5rem',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '2rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
  },
};

export default Navbar;