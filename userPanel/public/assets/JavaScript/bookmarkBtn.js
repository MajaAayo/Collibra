        const bookmarksList = document.getElementById('bookmarks-list');
        const noBookmarksMessage = document.getElementById('no-bookmarks');
        const bookmarkCountSpan = document.querySelector('.bookmark-count');
        

        let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || initialBookmarks;

        function updateBookmarkCount() {
            bookmarkCountSpan.textContent = `(${bookmarks.length})`;
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        }

        function displayBookmarks() {
            bookmarksList.innerHTML = '';
            if (bookmarks.length === 0) {
                noBookmarksMessage.style.display = 'block';
                bookmarksList.style.display = 'none';
            } else {
                noBookmarksMessage.style.display = 'none';
                bookmarksList.style.display = 'block';
                bookmarks.forEach((book) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'book-item';
                    listItem.innerHTML = `
                        <i class="fa-regular fa-bookmark bookmark-icon bookmarked"></i>
                        <div class="book-details">
                            <span class="book-title">${book.title}</span>
                            <span class="book-author">by ${book.author}</span>
                        </div>
                        <button class="remove-bookmark">Remove</button>
                    `;
                    const removeButton = listItem.querySelector('.remove-bookmark');

                    removeButton.addEventListener('click', (event) => {
                        event.stopPropagation();
                        removeBookmark(book);
                    });

                    listItem.addEventListener('click', () => {
                        window.location.href = book.bookUrl;
                    });
                    bookmarksList.appendChild(listItem);
                });
            }
            updateBookmarkCount();
        }
        function addBookmark(book) {
            const isBookMarked = bookmarks.some(b => b.title === book.title);
            if (!isBookMarked) {
                bookmarks.push(book);
                localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                updateBookmarkCount();
                displayBookmarks();
            }
        }

        function removeBookmark(book) {
            bookmarks = bookmarks.filter((b) => b.title !== book.title);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            updateBookmarkCount();
            displayBookmarks();
        }

        displayBookmarks();

        window.addEventListener('storage', (event) => {
            if (event.key === 'bookmarks') {
                bookmarks = JSON.parse(event.newValue) || [];
                displayBookmarks();
            }
        });