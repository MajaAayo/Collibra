// import necessary modules and components
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import "../css/style.css";

// Check login status and render admin panel 
const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("admin")
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'fiction',
    description: '',
    publication_year: '',
    coverImage: null,
    bookPdf: null,
    updated_by: 'Admin',
    updated_on: ''
  });

  // Reset file input fields
  const coverImageRef = useRef(null);
  const bookPdfRef = useRef(null);
// Fetch books when logged in
  useEffect(() => {
    if (isLoggedIn) fetchBooks();
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await axios.post("http://localhost:5000/api/login", { username, password });
      if (res.data?.message === "Login successful") {
        sessionStorage.setItem("admin", JSON.stringify(res.data.admin)); // use sessionStorage
        setIsLoggedIn(true);
      } else {
        setLoginError("Invalid username or password.");
      }
    } catch (err) {
      setLoginError(err.response?.data?.error || "Login failed.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin");
    setIsLoggedIn(false);
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books');
      setBooks(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books.');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.genre) {
      setError('Title, author, and genre are required.');
      return;
    }

    // Prepare form data for file upload ✔ Backend will store files and save record in DB
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      await axios.post('http://localhost:5000/api/books', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Book added!');
      // Clear form and refresh book list
      fetchBooks();
      setFormData({
        title: '',
        author: '',
        genre: 'fiction',
        description: '',
        publication_year: '',
        coverImage: null,
        bookPdf: null,
        updated_by: 'Admin',
        updated_on: ''
      });
      coverImageRef.current.value = '';
      bookPdfRef.current.value = '';
    } catch (err) {
      setError('Failed to save book.');
    }
  };
// fpr publication year options
  const years = Array.from({ length: 2025 - 1800 + 1 }, (_, i) => 1800 + i);
// show login page and hide admin panel if not logged in
  if (!isLoggedIn) {
    return (
      <div className="admin-container" style={{ maxWidth: 400, margin: "60px auto", padding: 32, background: "#f9f9f9", borderRadius: 8 }}>
        <h1 style={{ textAlign: "center" }}>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username:</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {loginError && <p style={{ color: 'red', textAlign: 'center' }}>{loginError}</p>}
          <button type="submit" className="submit-btn" style={{ width: "100%" }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="admin-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Admin Panel</h1>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <div className="form-container">
          <h2>Add New Book</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title:</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Author:</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Genre:</label>
              <select name="genre" value={formData.genre} onChange={handleChange} required>
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
              <textarea name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Publication Year:</label>
              <select name="publication_year" value={formData.publication_year} onChange={handleChange} required>
                <option value="" disabled>Select year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Cover Image:</label>
              <input type="file" name="coverImage" onChange={handleFileChange} ref={coverImageRef} />
            </div>
            <div className="form-group">
              <label>Book PDF:</label>
              <input type="file" name="bookPdf" onChange={handleFileChange} ref={bookPdfRef} />
            </div>
            <button type="submit" className="submit-btn">Add Book</button>
          </form>
        </div>

        <div className="books-list">
          <h2>Books</h2>
          {books.length === 0 ? <p>No books found.</p> : (
            <table>
              <thead>
                <tr><th>Title</th><th>Author</th><th>Genre</th></tr>
              </thead>
              <tbody>
                {books.map(b => <tr key={b.id}><td>{b.title}</td><td>{b.author}</td><td>{b.genre}</td></tr>)}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
