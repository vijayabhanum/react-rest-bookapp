import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { bookService } from "../../api/bookService";
import Loading from "../layout/Loading";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isLoggedin = !!localStorage.getItem('access_token');
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);


  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.getBookById(id);
      setBook(response.data);
    } catch (err) {
      setError('failed to load book details');
      console.error('error fetching book', err);
    } finally {
      setLoading(false);
    }
  },[id]);

  useEffect(() => {
  fetchBook();
  }, [fetchBook]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this \
      book')) {
      try {
        await bookService.deleteBook(id);
        alert('Book deleted succesfully');
        navigate('/');
      } catch (err) {
        alert('failed to delete book ');
        console.error('error deleting book', err);
      }
    }
  };

  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload pdf file only');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('pdf size more than 10 mb');
      return;
    }

    try {
      setUploadingPDF(true);
      const formData = new FormData();
      formData.append('pdf_file', file);
      await bookService.partialUpdateBook(id, formData);
      alert('pdf uploaded succesfully');
    } catch (err) {
      alert('failed to upload pdf ');
      console.log("error uploading pdf", err);
    } finally {
      setUploadingPDF(false);
      event.target.value = '';
    }
  };


  const handlePDFDownload = async () => {
    try {
      setDownloadingPDF(true);
      const response = await bookService.downloadPDF(id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${book.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('failed to download pdf');
      console.error('error downloading pdf', err);
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handlePDFDelete = async () => {
    if (window.confirm('Are you sure you want to delete \
      PDF file?')) {
      try {
        await bookService.deletePDF(id);
        alert('pdf deleted succrsfullt');
        fetchBook();
      } catch (err) {
        alert('failed to delete PDF');
        console.error('error deleting pdf', err);
      }
    }
  };

  if (loading) return <Loading />;

  if (error || !book) {
    return (
      <div style={styles.error}>
        <h2>⚠️ {error || 'Book not found'}</h2>
        <Link to="/" style={styles.link}>
          Back to Books
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Link to="/" styles={styles.backLink}>
        ← Back to Books
      </Link>

      <div style={styles.card}>
        <h1 style={styles.title}>
          {book.title}
        </h1>
        <div style={styles.authorSection}>
          <h3 style={styles.authorLabel}>
            Author
          </h3>
          <p style={styles.authorName}>
            {book.author.name}
          </p>

          {book.author.bio && (
            <p style={styles.authorBio}>
              {book.author.bio}
            </p>
          )}
        </div>

        
        {book.tags && book.tags.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionLabel}>
              Tags
            </h3>
            <div style={styles.tags}>
              {book.tags.map((tag) => (
                <span key={tag.id} style={styles.tag}>
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {book.description && (
          <div style={styles.section}>
            <h3 style={styles.sectionLabel}>
              Description
            </h3>
            <p style={styles.description}>
              {book.description}
            </p>
          </div>
        )}
        
        <div style={styles.metadata}>
          {book.isbn && (
            <div style={styles.metaItem}>
              <strong>ISBN:</strong>
              {book.isbn}
            </div>
          )}
          {book.published_date && (
            <div style={styles.metaItem}>
              <strong>Published:</strong>
              {new Date(book.published_date).toLocaleDateString()}
            </div>
          )}

          {isLoggedin && (
            <div style={styles.actions}>
              <button
                onClick={() => navigate(`/edit-book/${book.id}`)}
                style={styles.editButton}
              >
                Edit Book
              </button>
              <button
                onClick={handleDelete}
                style={styles.deleteButton}
              >
                Delete Book
              </button>

            </div>)}

        </div>

        <div>
          <h2>PDF File</h2>
          {book.has_pdf && (
            <div>
              <p>PDF File available</p>
              <div>
                <button
                  onClick={handlePDFDownload}
                  disabled={downloadingPDF}
                >
                  {downloadingPDF ? 'Downloading' : 'Download PDF'}
                </button>
                {isLoggedin && (
                <button
                  onClick={handlePDFDelete}
                >Delete PDF
                </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <h2>Metadata</h2>
          <p><strong>Created:</strong>
            {new Date(book.created_at).toLocaleString()}</p>
          <p><strong>Updated:</strong>
            {new Date(book.updated_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};



const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  backLink: {
    display: 'inline-block',
    color: '#3498db',
    textDecoration: 'none',
    marginBottom: '1.5rem',
    fontSize: '1rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '1.5rem',
    fontSize: '2rem',
  },
  authorSection: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
  },
  authorLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  authorName: {
    fontSize: '1.25rem',
    color: '#2c3e50',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0',
  },
  authorBio: {
    color: '#555',
    lineHeight: '1.6',
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginBottom: '0.75rem',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tag: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
  },
  description: {
    color: '#555',
    lineHeight: '1.8',
    fontSize: '1.05rem',
  },
  metadata: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
  },
  metaItem: {
    color: '#555',
    marginBottom: '0.5rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
  },
  editButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    color: '#e74c3c',
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
  },
  
};

export default BookDetail;