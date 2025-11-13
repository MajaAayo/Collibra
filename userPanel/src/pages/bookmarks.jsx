import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setBookmarks(storedBookmarks);
  }, []);

  const removeBookmark = (bookToRemove) => {
    const updatedBookmarks = bookmarks.filter(
      (book) => book.title !== bookToRemove.title
    );
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="main-content">
      <div className="bookmarks-header">
        <h1>My Bookmarks</h1>
      </div>
      
      {bookmarks.length === 0 ? (
        <div className="no-bookmarks">
          <p>No bookmarks yet.</p>
          <p>Start adding some from the Explore page!</p>
        </div>
      ) : (
        <ul className="bookmarks-list">
          {bookmarks.map((book, index) => (
            <li key={index} className="bookmark-item">
              <div className="bookmark-info">
                <div className="book-title">{book.title}</div>
                <div className="book-author">by {book.author}</div>
              </div>
              <button
                className="remove-bookmark"
                onClick={() => removeBookmark(book)}
                aria-label={`Remove ${book.title} from bookmarks`}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookmarks;