import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const BookCard = ({ book }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState(
    JSON.parse(localStorage.getItem('bookmarks')) || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRestrictedAction = (action) => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Login',
        text: `You need to log in to ${action}.`,
        confirmButtonText: 'Login',
      }).then(() => {
        navigate('/signlog');
      });
      return false;
    }
    return true;
  };

  const toggleBookmark = () => {
    if (!handleRestrictedAction('bookmark this book')) return;

    const isBookmarked = bookmarks.some((b) => b.title === book.title);
    let updatedBookmarks;
    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter((b) => b.title !== book.title);
    } else {
      updatedBookmarks = [...bookmarks, book];
    }
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Add Escape key listener and click-outside-to-close
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="book-card">
        <img src={book.cover} alt={book.title} />
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
        <div className="book-actions">
          <button
            onClick={() => {
              if (!handleRestrictedAction('read this book')) return;
              window.location.href = book.bookUrl;
            }}
          >
            Read
          </button>
          <button
            onClick={() => {
              if (!handleRestrictedAction('download this book')) return;
              // Implement download logic
            }}
          >
            Download
          </button>
          <button onClick={openModal}>View Details</button>
          <button
            onClick={toggleBookmark}
            className={bookmarks.some((b) => b.title === book.title) ? 'bookmarked' : ''}
          >
            <i className="fa-regular fa-bookmark"></i>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              ×
            </button>
            <div className="modal-body">
              <img src={book.cover} alt={book.title} className="modal-book-cover" />
              <div className="modal-details">
                <h2>{book.title}</h2>
                <h4>by {book.author}</h4>
                <p><strong>Genre:</strong> <span className="genre">{book.genre}</span></p>
                <p><strong>Publication Year:</strong> {book.publicationYear}</p>
                <p>{book.description}</p>
                <div className="modal-actions">
                  <button
                    className="read-now"
                    onClick={() => {
                      if (!handleRestrictedAction('read this book')) return;
                      window.location.href = book.bookUrl;
                    }}
                  >
                    Read Now
                  </button>
                  <button
                    className="download"
                    onClick={() => {
                      if (!handleRestrictedAction('download this book')) return;
                      // Implement download logic
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;