import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBookmark } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
    const [bookmarkCount, setBookmarkCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [allBooks, setAllBooks] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // Fetch all books once on component mount
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/books');
                const fetchedBooks = response.data.map((book) => ({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    genre: book.genre,
                    description: book.description || 'No description available',
                    publicationYear: book.publication_year,
                    cover: book.cover_image_path
                        ? `http://localhost:5000/uploads/${book.cover_image_path}`
                        : 'https://via.placeholder.com/150x200?text=No+Cover',
                    bookUrl: book.pdf_path
                        ? `http://localhost:5000/uploads/${book.pdf_path}`
                        : '#',
                }));
                setAllBooks(fetchedBooks);
            } catch (err) {
                console.error('Error fetching books:', err);
            }
        };

        fetchBooks();
    }, []);

    const updateBookmarkCount = useCallback(() => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        setBookmarkCount(bookmarks.length);
    }, []);

    const handleStorageChange = useCallback(() => {
        updateBookmarkCount();
    }, [updateBookmarkCount]);

    useEffect(() => {
        updateBookmarkCount();
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('bookmarkUpdate', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('bookmarkUpdate', handleStorageChange);
        };
    }, [handleStorageChange, updateBookmarkCount]);

    // Handle search input change with real-time filtering
    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length > 0) {
            const lowerQuery = query.toLowerCase();
            const results = allBooks.filter((book) =>
                book.title.toLowerCase().includes(lowerQuery) ||
                book.author.toLowerCase().includes(lowerQuery)
            );
            setSearchResults(results);
            setShowDropdown(true);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setShowDropdown(false);
        }
    };

    const handleResultClick = (book) => {
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`, { state: { selectedBook: book } });
        setShowDropdown(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="top-bar"></div>
            <nav className="navbar">
                <div className="logo">
                    <Link to="/">
                        <img src="/assets/Logo/pngl.png" alt="Collibra Logo" />
                        <span>COLLIBRA</span>
                    </Link>
                </div>

                <div className="search-container" ref={searchRef}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by book name or author..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => searchQuery && setShowDropdown(true)}
                        aria-label="Search for books"
                    />
                    <button
                        className="search-button"
                        aria-label="Search"
                        onClick={handleSearch}
                    >
                        <FaSearch />
                    </button>

                    {/* Search Results Dropdown */}
                    {showDropdown && (
                        <div className="search-dropdown">
                            {searchResults.length > 0 ? (
                                <div className="search-results-list">
                                    {searchResults.slice(0, 5).map((book) => (
                                        <div
                                            key={book.id}
                                            className="search-result-item"
                                            onClick={() => handleResultClick(book)}
                                        >
                                            <img src={book.cover} alt={book.title} className="result-cover" />
                                            <div className="result-content">
                                                <p className="result-title">{book.title}</p>
                                                <p className="result-author">by {book.author}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {searchResults.length > 5 && (
                                        <div className="search-view-all">
                                            View all {searchResults.length} results
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="search-no-results">
                                    No books found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <ul className="nav-links">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/bookmarks" className="bookmark-btn" aria-label="Bookmarks">
                            <FaBookmark />
                            <span className="bookmark-count">({bookmarkCount})</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Navbar;