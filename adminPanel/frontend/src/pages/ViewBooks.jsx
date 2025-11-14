// src/pages/ViewBooks.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import "../css/style.css";

const ViewBooks = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch all books from the backend API
  // send GET request to /api/books if backend is disabled show error message
  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(
        "Failed to fetch books. Please ensure the backend server is running."
      );
    }
  };

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the book "${title}"?`
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/books/${id}`);
        fetchBooks();
      } catch (err) {
        console.error("Error deleting book:", err);
        setError("Failed to delete book. Please try again.");
      }
    }
  };

  // handle downloading book PDF
  const handleDownloadBook = async (pdfFileName, bookTitle) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/uploads/${pdfFileName}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${bookTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading book:", err);
      setError("Failed to download book. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="admin-container">
        <h1>Error: {error}</h1>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="admin-container">
        <h1>View All Books</h1>
        <div className="books-list">
          {books.length === 0 ? (
            <p>No books found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Description</th>
                  <th>Publication Year</th>
                  <th>PDF</th>
                  <th>Updated By</th>
                  <th>Updated On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>
                      {book.cover_image_path ? (
                        <img
                          src={`http://localhost:5000/uploads/${book.cover_image_path}`}
                          alt={book.title}
                          style={{ width: "50px", height: "auto" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>

                    {/* ✅ Description section with CSS classes */}
                    <td className="desc-cell">
                      <div className="desc-tooltip">
                        <button
                          className="desc-btn"
                          onClick={(e) => {
                            const tooltip = e.currentTarget.nextSibling;
                            tooltip.style.display =
                              tooltip.style.display === "block"
                                ? "none"
                                : "block";
                          }}
                        >
                          ?
                        </button>
                        <div className="desc-box">
                          {book.description || "No description available."}
                        </div>
                      </div>
                    </td>

                    <td>{book.publication_year}</td>
                    <td>
                      {book.pdf_path ? (
                        <button
                          onClick={() =>
                            handleDownloadBook(book.pdf_path, book.title)
                          }
                          className="pdf-btn"
                        >
                          Download PDF
                        </button>
                      ) : (
                        "No PDF"
                      )}
                    </td>
                    <td>{book.updated_by}</td>
                    <td>{new Date(book.updated_on).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(book.id, book.title)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBooks;
