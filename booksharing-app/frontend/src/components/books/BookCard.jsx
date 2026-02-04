import React from "react";
import { Link } from 'react-router-dom';

const BookCard = ({ book, onTagClick }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>
        {book.title}
      </h3>
      <p style={styles.author}>
        by {book.author_name}
      </p>

      {book.tags && book.tags.length > 0 && (
        <div style={styles.tags}>
          {book.tags.map((tag) => (
            <button
              key={tag.id}
              onClick={(e) => {
                e.preventDefault();
                if (onTagClick) onTagClick(tag.name);
              }}
              style={styles.tag}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {book.description && (
        <p style={styles.description}>
          {book.description.substring(0, 100)}
          {book.description.length > 100 ? '...':''}
        </p>
      )}

      <Link to={`/books/${book.id}`} style={styles.link}>
        View Details →
      </Link>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  title: {
    margin: '0 0 0.5rem 0',
    color: '#2c3e50',
    fontSize: '1.25rem',
  },
  author: {
    margin: '0 0 1rem 0',
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  tag: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
  },
  description: {
    color: '#555',
    marginBottom: '1rem',
    lineHeight: '1.5',
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default BookCard;