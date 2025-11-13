const token = localStorage.getItem('token');
const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

async function fetchUsers() {
  const res = await fetch('/admin/users', { headers });
  const users = await res.json();
  const tbody = document.querySelector('#users-table tbody');
  tbody.innerHTML = '';
  users.forEach(user => {
    tbody.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <select onchange="updateUserRole(${user.id}, this.value)">
            <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </td>
        <td><button onclick="deleteUser(${user.id})">Delete</button></td>
      </tr>`;
  });
}

async function updateUserRole(id, role) {
  await fetch(`/admin/users/${id}/role`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ role })
  });
  fetchUsers();
}

async function deleteUser(id) {
  await fetch(`/admin/users/${id}`, { method: 'DELETE', headers });
  fetchUsers();
}

async function fetchBooks() {
  const res = await fetch('/admin/books', { headers });
  const books = await res.json();
  const tbody = document.querySelector('#books-table tbody');
  tbody.innerHTML = '';
  books.forEach(book => {
    tbody.innerHTML += `
      <tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.category}</td>
        <td>${book.filename}</td>
        <td><button onclick="deleteBook(${book.id})">Delete</button></td>
      </tr>`;
  });
}

async function deleteBook(id) {
  await fetch(`/admin/books/${id}`, { method: 'DELETE', headers });
  fetchBooks();
}

// Add New Book (Including File Upload)
document.getElementById('add-book-form').addEventListener('submit', async e => {
  e.preventDefault();

  const title = document.getElementById('book-title').value;
  const author = document.getElementById('book-author').value;
  const category = document.getElementById('book-category').value;
  const pdfFile = document.getElementById('book-pdf').files[0]; // File input for PDF

  const formData = new FormData();
  formData.append('title', title);
  formData.append('author', author);
  formData.append('category', category);
  formData.append('bookPDF', pdfFile);

  const res = await fetch('/admin/books', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData
  });

  if (res.ok) {
    e.target.reset(); // Reset form
    fetchBooks(); // Refresh book list
  } else {
    console.error('Error uploading book');
  }
});

window.onload = () => {
  fetchUsers();
  fetchBooks();
};
