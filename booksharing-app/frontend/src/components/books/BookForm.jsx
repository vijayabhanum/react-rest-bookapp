import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { authorService, bookService, tagService } from '../../api/bookService';
import Loading from '../layout/Loading';
import SuccessMessage from '../layout/SuccessMessage';


const BookForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: '',
    published_date: '',
    tags: [],
  });

  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [authorsRes, tagsRes] = await Promise.all([
        authorService.getAllAuthors(),
        tagService.getAllTags(),
      ]);
      setAuthors(authorsRes.data);
      setTags(tagsRes.data);

      if (isEdit && id) {
        const bookRes = await bookService.getBookById(id);
        const book = bookRes.data;
        setFormData({
          title: book.title,
          author: book.author.id,
          description: book.description || '',
          isbn: book.isbn || '',
          published_date: book.published_date || '',
          tags: book.tags.map((tag) => tag.id),
        });
      }
    } catch (err) {
      setError('failed to load from data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [isEdit, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map((option) =>
      parseInt(option.value));
    setFormData((prev) => ({
      ...prev,
      tags: selectedIds,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.author) {
      setError('Title and Author are required!');
    }

    try {
      setSubmitting(true);
      setError(null);

      const submitData = {
        ...formData,
        author: parseInt(formData.author),
        published_date: formData.published_date || null,
      };

      if (isEdit) {
        await bookService.updateBook(id, submitData);
        setSuccessMessage('Book updated successfully!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        await bookService.createBook(submitData);
        // alert('book added successfully');
        setSuccessMessage('Book added successfully!');
        setTimeout(() => navigate('/'), 2000);
      }

      navigate('/');
    } catch (err) {
      console.error('error saving book', err);

      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          setError(errorData);
        } else if (errorData.non_field_errors) {
          setError(errorData.non_field_errors[0]);
        } else {
          const firstError = Object.values(errorData)[0];
          setError(Array.isArray(firstError) ? firstError[0] : firstError);
        }
      } else {
        setError('Failed to save Book. please Try again!');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        {isEdit ? 'Edit Book' : 'Add New Book'}
      </h1>

      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      <SuccessMessage 
        message={successMessage} 
        onClose={() => setSuccessMessage('')}
      />

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Title */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Title <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={styles.input}
            required
            placeholder="Enter book title"
          />
        </div>

        {/* Author */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Author <span style={styles.required}>*</span>
          </label>
          <select
            name="author"
            value={formData.author}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">
              -- Select Author --
            </option>
            {authors.map((author) => (
              <option
                key={author.id}
                value={author.id}
              >
                {author.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            rows="5"
            placeholder="Enter book description"
          />
        </div>

        {/* Tags */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Tags (Hold Ctrl/Cmd to select multiple)
          </label>
          <select
            name="tags"
            value={formData.tags}
            onChange={handleTagChange}
            style={styles.selectMultiple}
            multiple
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        {/* ISBN */}
        <div style={styles.formGroup}>
          <label style={styles.label}>ISBN</label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter ISBN (optional)"
            maxLength="13"
          />
        </div>

        {/* Published Date */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Published Date</label>
          <input
            type="date"
            name="published_date"
            value={formData.published_date}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Buttons */}
        <div style={styles.buttonGroup}>
          <button
            type="submit"
            style={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? 'Saving...' : isEdit ?
              'Updating Book' : 'Add Book'}
          </button>
          {submitting && (
          <button
            type="button"
            onClick={() => navigate('/')}
            style={styles.cancelButton}
          >
            Cancel
          </button>)}
        </div>

      </form>
    </div>
  )
};



const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  errorBox: {
    backgroundColor: '#ffe6e6',
    color: '#d63031',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    border: '1px solid #d63031',
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  selectMultiple: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    minHeight: '120px',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  submitButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
};

export default BookForm;