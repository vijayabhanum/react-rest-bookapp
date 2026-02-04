import React, { useState, useEffect, useCallback } from 'react';
import { authorService } from '../../api/bookService';
import Loading from '../layout/Loading';


const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authorService.getAllAuthors();
      setAuthors(response.data);
    } catch (err) {
      setError('failed to load authors');
      console.error('Error fetching authors', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div style={styles.error}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 style={styles.title}>Authors</h1>
      {authors.length === 0 ? (
        <div style={styles.empty}>
          <h2>No authors found</h2>
          <p>Add authros in django admin</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {authors.map((author) => (
            <div key={author.id} style={styles.card}>
              <h3 style={styles.authorName}>
                {author.name}
              </h3>
              {author.bio && (
                <p style={styles.bio}>
                  {author.bio.substring(0, 150)}...
                </p>
              )}
              <div style={styles.meta}>
                <span style={styles.badge}>
                  {author.books_count}
                  {author.books_count === 1 ? 'book' : 'books'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



const styles = {
  title: {
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  authorName: {
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  bio: {
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  meta: {
    display: 'flex',
    gap: '0.5rem',
  },
  badge: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    color: '#e74c3c',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#7f8c8d',
  },
};

export default AuthorList;