import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/BookCard';
import '../css/style.css';

const Search = () => {
    const [searchParams] = useSearchParams();
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // It reads the query from the URL.
// Saves it in searchQuery.
// Calls performSearch(query) to fetch and filter books.
    useEffect(() => {
        const query = searchParams.get('query');
        setSearchQuery(query || '');

        if (query) {
            performSearch(query);
        }
    }, [searchParams]);

    const performSearch = async (query) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/api/books'); //Sends a GET request to your backend to get all books.
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

            // Filter books based on title or author
            // Checks each book's title or author to see if it contains the search term.
            const lowerQuery = query.toLowerCase();
            const results = fetchedBooks.filter((book) =>
                book.title.toLowerCase().includes(lowerQuery) ||
                book.author.toLowerCase().includes(lowerQuery)
            );

            setFilteredBooks(results);
            
            if (results.length === 0) {
                setError(`No books found matching "${query}". Please try searching with a different title or author name.`);
            }
        } catch (err) {
            console.error('Error fetching books:', err);
            setError('Failed to fetch books. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="search-page-container">
            <div className="search-page-header">
                <h1>Search Results</h1>
                {searchQuery && (
                    <p className="search-query-display">
                        Searching for: <strong>"{searchQuery}"</strong>
                    </p>
                )}
            </div>

            {isLoading && (
                <div className="loading-container">
                    <p>Loading search results...</p>
                </div>
            )}

            {error && (
                <div className="error-container">
                    <p className="error-message">📚 {error}</p>
                </div>
            )}

            {!isLoading && filteredBooks.length > 0 && (
                <>
                    <div className="search-results-summary">
                        <p>Found <strong>{filteredBooks.length}</strong> book(s)</p>
                    </div>
                    <div className="book-grid">
                        {filteredBooks.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                </>
            )}

            {!isLoading && filteredBooks.length === 0 && !error && searchQuery && (
                <div className="no-results-container">
                    <p>No results found for "{searchQuery}"</p>
                </div>
            )}

            {!searchQuery && (
                <div className="empty-search-container">
                    <p>Enter a book title or author name to search</p>
                </div>
            )}
        </div>
    );
};

export default Search;
