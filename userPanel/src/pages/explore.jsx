// userPanel/src/pages/explore.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import "../css/style.css";

const Explore = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [error, setError] = useState(null);

  // Function to fetch books from the adminPanel backend
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/books");
      const fetchedBooks = response.data.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description || "No description available",
        publicationYear: book.publication_year,
        cover: book.cover_image_path
          ? `http://localhost:5000/uploads/${book.cover_image_path}`
          : "https://via.placeholder.com/150x200?text=No+Cover",
        bookUrl: book.pdf_path
          ? `http://localhost:5000/uploads/${book.pdf_path}`
          : "#",
      }));
      setBooks(fetchedBooks);
      setFilteredBooks(fetchedBooks); // Initially display all books
      setError(null);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to fetch books. Please try again later.");
    }
  };

  // Fetch books on component mount and set up WebSocket
  useEffect(() => {
    fetchBooks();

    // Set up WebSocket connection
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "BOOKS_UPDATED") {
        console.log("Books updated, fetching new data...");
        fetchBooks();
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  const normalizeGenre = (genre) => {
    return genre.toLowerCase().trim();
  };

  const handleFilterChange = (event) => {
    const genre = event.target.value;
    setSelectedGenre(genre);

    if (genre === "all") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) =>
        normalizeGenre(book.genre).includes(normalizeGenre(genre))
      );
      setFilteredBooks(filtered);
    }
  };

  return (
    <div className="explore-container">
      <aside className="sidebar">
        <h2>Filter by Genre</h2>
        <div className="filter-group">
          <label htmlFor="genre">Genre:</label>
          <select
            id="genre"
            value={selectedGenre}
            onChange={handleFilterChange}
            aria-label="Filter books by genre"
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
          </select>
        </div>
      </aside>
      <main className="book-grid">
        {error ? (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        ) : filteredBooks.length === 0 ? (
          <p>No books found.</p>
        ) : (
          filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        )}
      </main>
    </div>
  );
};

export default Explore;