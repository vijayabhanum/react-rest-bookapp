import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import BookList from './components/books/BookList';
import BookDetail from './components/books/BookDetail';
import BookForm from './components/books/BookForm';
import AuthorList from './components/authors/AuthorList';
import Login from './components/login/Login';
import './App.css'

function App() {

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'access_token') {
        if (event.newValue === null) {
          window.location.href = '/login';
        } else {
          window.location.reload();
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <div className='App'>
        <Navbar />
        <div style={styles.container}>
          <Routes>
            <Route path='/'
              element={<BookList />} />

            <Route path='/books/:id'
              element={<BookDetail />} />

            <Route path='/authors'
              element={<AuthorList />} />

            <Route path='/add-book'
              element={<BookForm isEdit={false} />} />

            <Route path='/edit-book/:id'
              element={<BookForm isEdit={true} />} />
            
            <Route path='/login'
              element={<Login />} />

            {/* Catch-all route for 404 */}
            <Route path="*"
              element={<h1>404 - Page Not Found</h1>} />
            
          </Routes>
        </div>
      </div>
    </Router>
  )
}


// What :id Means (URL Parameters)
// javascript
// <Route path="/books/:id" element={<BookDetail />} />
// :id is a dynamic parameter (like <int:id> in Django)

// Matches any value: /books/1, /books/5, /books/999

// Component can access it using useParams()

// javascript
// // In BookDetail.jsx
// const { id } = useParams();  // id = "5" if URL is /books/5

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
};

export default App
