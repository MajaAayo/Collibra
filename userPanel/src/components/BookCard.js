import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const BookCard = ({ book }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        setIsBookmarked(
            storedBookmarks.some(
                (b) => b.title === book.title && b.author === book.author
            )
        );
    }, [book.title, book.author]);

    const toggleBookmark = () => {
        const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        let updatedBookmarks;

        if (isBookmarked) {
            updatedBookmarks = storedBookmarks.filter(
                (b) => !(b.title === book.title && b.author === book.author)
            );
        } else {
            updatedBookmarks = [...storedBookmarks, book];
        }

        // Update localStorage with a slight delay to prevent race conditions
        setTimeout(() => {
            localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
            setIsBookmarked(!isBookmarked);

            // Dispatch storage event for cross-tab updates
            window.dispatchEvent(new Event('storage'));

            // Dispatch custom event for same-tab updates
            window.dispatchEvent(new CustomEvent('bookmarkUpdate'));
        }, 0);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [isDownloading, setIsDownloading] = useState(false);

    // Helper to derive a safe filename from the book title or URL
    const deriveFilename = () => {
        const urlParts = (book.bookUrl || '').split('/');
        const lastPart = urlParts[urlParts.length - 1] || 'file';
        const extMatch = lastPart.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
        const ext = extMatch ? `.${extMatch[1]}` : '';
        const safeTitle = (book.title || 'book').replace(/[^a-z0-9\-_. ]/gi, '_');
        return `${safeTitle}${ext}`;
    };

    // Direct download: fetches the file as a blob and triggers a client-side download
    const handleDownload = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!book || !book.bookUrl || book.bookUrl === '#') {
            alert('No downloadable file available for this book.');
            return;
        }

        setIsDownloading(true);
        try {
            const response = await fetch(book.bookUrl); // fetch(...) sends an HTTP request to the URL: book.bookUrl
            if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
            const blob = await response.blob(); // Binary large object converts response data into a blob format .pdf, .epub, etc.
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = deriveFilename();
            document.body.appendChild(a);
            a.click();
            
            // Wait a moment for the download to start before cleanup
            setTimeout(() => {
                a.remove();
                window.URL.revokeObjectURL(url);
                console.log('Download started for: ' + deriveFilename());
            }, 100);
        } catch (err) {
            console.error('Download failed:', err);
            alert('Download failed. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleRead = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!book || !book.bookUrl || book.bookUrl === '#') {
            alert('No readable file available for this book.');
            return;
        }
        
        // Open in new tab
        window.open(book.bookUrl, '_blank');
    };

    return (
        <>
            <div className="book-card">
                <div className="image-container">
                    <img src={book.cover} alt={book.title} />
                    <button
                        className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
                        onClick={toggleBookmark}
                        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    >
                        {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                    <div className="book-actions">
                        <button
                            type="button"
                            onClick={handleRead}
                            aria-label="Read book"
                        >
                            Read
                        </button>
                        <button
                            type="button"
                            onClick={handleDownload}
                            disabled={isDownloading}
                            aria-label="Download book"
                        >
                            {isDownloading ? 'Downloading...' : 'Download'}
                        </button>
                    </div>
                </div>
                <h3>{book.title}</h3>
                <p>by {book.author}</p>
                <button className="view-details-button" onClick={openModal}>
                    View Details
                </button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="book-details-modal">
                        <span
                            className="modal-close-symbol"
                            onClick={closeModal}
                            aria-label="Close modal"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    closeModal();
                                }
                            }}
                        >
                            ×
                        </span>
                        <img src={book.cover} alt={book.title} className="modal-book-cover" />
                        <h2>{book.title}</h2>
                        <p className="modal-book-author">
                            <strong>Author:</strong> {book.author}
                        </p>
                        <p className="modal-book-description">{book.description}</p>
                        <div className="modal-buttons">
                            <button
                                type="button"
                                onClick={handleRead}
                                aria-label="Read book"
                            >
                                Read
                            </button>
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={isDownloading}
                                aria-label="Download book"
                            >
                                {isDownloading ? 'Downloading...' : 'Download'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookCard;