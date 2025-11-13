// src/pages/EditBook.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar"; // Import the Navbar component
import "../css/style.css";

const EditBook = () => {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'fiction',
    description: '',
    publication_year: '',
    coverImage: null,
    bookPdf: null,
    updatedBy: 'Admin',
    updatedOn: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books');
      console.log('Books fetched successfully:', res.data); // Log successful response
      const sortedBooks = res.data.sort((a, b) => a.title.localeCompare(b.title));
      setBooks(sortedBooks);
      // Don't auto-select the first book - let user select from dropdown
      setSelectedBookId('');
      setFormData({
        title: '',
        author: '',
        genre: 'fiction',
        description: '',
        publication_year: '',
        coverImage: null,
        bookPdf: null,
        updatedBy: 'Admin',
        updatedOn: ''
      });
    } catch (err) {
      console.error('Error fetching books:', err.message);
      console.error('Error details:', err.response ? err.response.data : err);
      setError('Failed to fetch books. Please ensure the backend server is running.');
    }
  };

  const handleBookSelect = (e) => {
    const bookId = e.target.value;
    setSelectedBookId(bookId);
    const book = books.find(b => b.id === parseInt(bookId));
    if (book) {
      let year = book.publication_year;
      const years = Array.from({ length: 2025 - 1800 + 1 }, (_, i) => 1800 + i);
      if (!years.includes(Number(year))) {
        year = '';
      }
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        publication_year: year,
        coverImage: null,
        bookPdf: null,
        updatedBy: 'Admin',
        updatedOn: book.updatedOn
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDateTime = new Date().toISOString();
      const updatedFormData = {
        ...formData,
        updatedOn: currentDateTime,
        updatedBy: 'Admin'
      };

      const data = new FormData();
      Object.keys(updatedFormData).forEach(key => {
        data.append(key, updatedFormData[key]);
      });

      await axios.put(`http://localhost:5000/api/books/${selectedBookId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData({
        title: '',
        author: '',
        genre: 'fiction',
        description: '',
        publication_year: '',
        coverImage: null,
        bookPdf: null,
        updatedBy: 'Admin',
        updatedOn: ''
      });
      setSelectedBookId('');
      fetchBooks();
    } catch (err) {
      console.error('Error updating book:', err.message);
      console.error('Error details:', err.response ? err.response.data : err);
      setError('Failed to update book. Please try again.');
    }
  };

  const years = Array.from({ length: 2025 - 1800 + 1 }, (_, i) => 1800 + i);

  if (error) {
    return <div className="admin-container"><h1>Error: {error}</h1></div>;
  }

  return (
    <div>
      <Navbar />
      <div className="admin-container">
        <h1>Update Book</h1>
        <div className="form-container">
          <h2>Select Book to Edit</h2>
          <div className="update-book-select">
            <select value={selectedBookId} onChange={handleBookSelect} required>
              <option value="" disabled>Select a book</option>
              {books.map(book => (
                <option key={book.id} value={book.id}>{book.title}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Author:</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Genre:</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
              >
                <option value="all">All Genres</option>
                <option value="romantic drama with sci-fi">Romantic drama with Sci-fi</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-fiction</option>
                <option value="romance">Romance</option>
                <option value="thriller">Thriller</option>
                <option value="fantasy">Fantasy</option>
                <option value="history">History</option>
                <option value="science">Science</option>
                <option value="biography">Biography</option>
                <option value="self-help">Self-help</option>
                <option value="mystery">Mystery</option>
                <option value="historical fiction">Historical Fiction</option>
                <option value="education">Education</option>
                
              </select>
            </div>
            
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Publication Year:</label>
              <select
                name="publication_year"
                value={formData.publication_year}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Book Cover Image:</label>
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            
            <div className="form-group">
              <label>Book PDF:</label>
              <input
                type="file"
                name="bookPdf"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </div>
            
            <div className="form-group">
              <label>Updated By:</label>
              <input
                type="text"
                name="updatedBy"
                value={formData.updatedBy}
                readOnly
              />
            </div>
            
            <div className="form-group">
              <label>Updated On:</label>
              <input
                type="text"
                name="updatedOn"
                value={formData.updatedOn || new Date().toISOString()}
                readOnly
              />
            </div>
            
            <button type="submit" className="submit-btn">
              Update Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBook;