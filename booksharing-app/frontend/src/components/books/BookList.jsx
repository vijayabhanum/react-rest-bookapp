import React, { useState, useEffect, useCallback } from 'react';
import { bookService } from '../../api/bookService';
import BookCard from './BookCard';
import Loading from '../layout/Loading';
import PromotionalVideo from '../video/video';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [selectedTag, setSelectedTag] = useState('');

  const fetchBooks = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    if (selectedTag) {
      const response = await bookService.getBooksByTag(
        selectedTag
      );
      setBooks(response.data);
    } else {
      const response = await bookService.getAllBooks(
        searchQuery, ordering
      );
      setBooks(response.data);
    }
  } catch (err) {
    setError('Failed to load books. make server running');
    console.error('error fetching books:', err);
  } finally {
    setLoading(false);
  }
  }, [searchQuery, ordering, selectedTag]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);


  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedTag('');
    setSearchQuery(searchTerm);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchQuery('');
    setSelectedTag('');
  };

  const handleTagClick = (tagName) => {
    setSelectedTag(tagName);
    setSearchQuery('');
    setSearchTerm('');
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div style={styles.error}>
        <h2>⚠️ {error}</h2>
        <button onClick={fetchBooks} style={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>

      <PromotionalVideo />
      <div style={styles.header}>

        <h1 style={styles.title}>
          Book Collection
        </h1>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder='Search books, authors...'
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
          <button type='submit' style={styles.searchButton}>
            🔍 Search
          </button>
          {(searchQuery || selectedTag) && (
            <button
              type='button'
              onClick={handleClearSearch}
              style={styles.clearButton}
            >
              ✕ Clear
            </button>
          )}
        </form>

        {selectedTag && (
          <div style={styles.activeFilter}>
            <span>
              Filter by tag: <strong>
                {selectedTag}
              </strong>
            </span>
            <button
              onClick={() => setSelectedTag('')}
              style={styles.removeFilterButton}
            >
              ✕
            </button>
          </div>
        )}

        <div style={styles.filters}>
          <label style={styles.label}>
            Sort by:
            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              style={styles.select}
            >
              <option value="-created_at">
                Newest First
              </option>
              <option value="created_at">
                Oldest First
              </option>
              <option value="title">
                Title (A-Z)
              </option>
              <option value="-title">
                Title (Z-A)
              </option>

            </select>
          </label>
        </div>
      </div>

      {books.length === 0 ? (
        <div style={styles.empty}>
          <h2>📚 No books found</h2>
          {selectedTag ? (
            <p>No books with tag "{selectedTag}"
            Try another tag or clear filter</p>
          ) : searchQuery ? (
              <p>No books match "{searchQuery}"
              Try different search item</p>
            ) : (
              <p>Try adding some books</p>    
          )}
        </div>
      ) : (
          <>
            <div style={styles.resultCount}>
              Showing {books.length} {books.length === 1
              ? 'book' : 'books'}
            </div>
            <div style={styles.grid}>
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onTagClick={handleTagClick}
              />
            ))}
            </div>
          </>
        
      )}
    </div>
  );
};


const styles = {
  header: {
    marginBottom: '2rem',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  searchForm: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  searchInput: {
    flex: 1,
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  searchButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
    clearButton: {
    padding: '0.75rem 1rem',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  activeFilter: {
    backgroundColor: '#e8f4f8',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #3498db',
  },
  removeFilterButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#555',
  },
  select: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    color: '#e74c3c',
  },
  retryButton: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#7f8c8d',
  },
};

export default BookList;