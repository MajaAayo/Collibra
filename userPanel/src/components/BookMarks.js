import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [downloadingIndex, setDownloadingIndex] = useState(null);

    useEffect(() => {
        const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        setBookmarks(storedBookmarks);
    }, []);

    const removeBookmark = (bookToRemove) => {
        const updatedBookmarks = bookmarks.filter(
            (book) => !(book.title === bookToRemove.title && book.author === bookToRemove.author)
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
                    <p>
                        Start adding some from the <Link to="/explore">Explore page</Link>!
                    </p>
                </div>
            ) : (
                <div className="book-grid">
                    {bookmarks.map((book, index) => (
                        <div key={`${book.title}-${book.author}-${index}`} className="book-card bookmark-item">
                            <div className="image-container">
                                <img src={book.cover} alt={book.title} />
                                <button
                                    className="remove-bookmark"
                                    onClick={() => removeBookmark(book)}
                                    aria-label={`Remove ${book.title} from bookmarks`}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <h3>{book.title}</h3>
                            <p>by {book.author}</p>
                            <div className="book-actions">
                                <button
                                    onClick={() => {
                                        window.location.href = book.bookUrl;
                                    }}
                                >
                                    Read
                                </button>
                                <button
                                    onClick={async () => {
                                        if (!book || !book.bookUrl || book.bookUrl === '#') {
                                            alert('No downloadable file available for this book.');
                                            return;
                                        }

                                        // Try to resolve URL to see if it's same-origin
                                        let resolvedUrl = null;
                                        try {
                                            resolvedUrl = new URL(book.bookUrl, window.location.href);
                                        } catch (e) {
                                            resolvedUrl = null;
                                        }

                                        const deriveFilename = () => {
                                            const urlParts = (book.bookUrl || '').split('/');
                                            const lastPart = urlParts[urlParts.length - 1] || 'file';
                                            const extMatch = lastPart.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
                                            const ext = extMatch ? `.${extMatch[1]}` : '';
                                            const safeTitle = (book.title || 'book').replace(/[^a-z0-9\-_. ]/gi, '_');
                                            return `${safeTitle}${ext}`;
                                        };

                                        // If unresolved or cross-origin, do a synchronous anchor click to avoid popup blocking
                                        if (!resolvedUrl || resolvedUrl.origin !== window.location.origin) {
                                            setDownloadingIndex(index);
                                            try {
                                                const a = document.createElement('a');
                                                a.href = book.bookUrl;
                                                a.target = '_blank';
                                                a.rel = 'noopener';
                                                a.download = deriveFilename();
                                                document.body.appendChild(a);
                                                a.click();
                                                a.remove();
                                            } catch (err) {
                                                console.error('Fallback anchor click failed', err);
                                                alert('Unable to download or open the file.');
                                            } finally {
                                                setDownloadingIndex(null);
                                            }
                                            return;
                                        }

                                        // Same-origin: fetch blob to give friendly filename
                                        setDownloadingIndex(index);
                                        try {
                                            const response = await fetch(book.bookUrl);
                                            if (!response.ok) throw new Error('Network response was not ok');
                                            const blob = await response.blob();
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = deriveFilename();
                                            document.body.appendChild(a);
                                            a.click();
                                            a.remove();
                                            window.URL.revokeObjectURL(url);
                                        } catch (err) {
                                            console.error('Download failed, opening URL instead', err);
                                            try {
                                                const a = document.createElement('a');
                                                a.href = book.bookUrl;
                                                a.target = '_blank';
                                                a.rel = 'noopener';
                                                document.body.appendChild(a);
                                                a.click();
                                                a.remove();
                                            } catch (openErr) {
                                                console.error(openErr);
                                                alert('Unable to download or open the file.');
                                            }
                                        } finally {
                                            setDownloadingIndex(null);
                                        }
                                    }}
                                    disabled={downloadingIndex === index}
                                >
                                    {downloadingIndex === index ? 'Downloading...' : 'Download'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookmarks;