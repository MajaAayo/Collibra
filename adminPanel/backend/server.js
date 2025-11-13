const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'K4sh@L2024',
  database: 'libopedia',
});

db.connect((err) => {
  if (err) return console.error('Error connecting to MySQL:', err);
  console.log('Connected to MySQL');
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  ws.on('close', () => console.log('WebSocket client disconnected'));
});

const broadcastUpdate = () => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify({ type: 'BOOKS_UPDATED' }));
  });
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ message: 'Login successful', admin: { username } });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

app.get('/api/books', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch books' });
    res.json(results);
  });
});

app.post('/api/books', upload.fields([{ name: 'coverImage' }, { name: 'bookPdf' }]), (req, res) => {
  const { title, author, genre, description, publication_year } = req.body;
  const coverImagePath = req.files['coverImage'] ? req.files['coverImage'][0].filename : null;
  const pdfPath = req.files['bookPdf'] ? req.files['bookPdf'][0].filename : null;

  if (!title || !author || !genre) return res.status(400).json({ error: 'Title, author, and genre are required.' });
  if (genre.length > 100) return res.status(400).json({ error: 'Genre must be 100 characters or less.' });

  const sql = 'INSERT INTO books (title, author, genre, description, publication_year, cover_image_path, pdf_path, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [title, author, genre, description || null, publication_year || null, coverImagePath, pdfPath, 'Admin'];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to add book' });
    broadcastUpdate();
    res.status(201).json({ message: 'Book added successfully' });
  });
});

app.put('/api/books/:id', upload.fields([{ name: 'coverImage' }, { name: 'bookPdf' }]), (req, res) => {
  const { id } = req.params;
  const { title, author, genre, description, publication_year } = req.body;
  const coverImagePath = req.files['coverImage'] ? req.files['coverImage'][0].filename : null;
  const pdfPath = req.files['bookPdf'] ? req.files['bookPdf'][0].filename : null;

  if (!title || !author || !genre) return res.status(400).json({ error: 'Title, author, and genre are required.' });

  db.query('SELECT cover_image_path, pdf_path FROM books WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch book' });
    if (results.length === 0) return res.status(404).json({ error: 'Book not found' });

    const book = results[0];
    let newCoverImagePath = coverImagePath || book.cover_image_path;
    let newPdfPath = pdfPath || book.pdf_path;

    let sql = 'UPDATE books SET title = ?, author = ?, genre = ?, description = ?, publication_year = ?, updated_by = ?';
    const values = [title, author, genre, description || null, publication_year || null, 'Admin'];

    if (coverImagePath) {
      sql += ', cover_image_path = ?';
      values.push(newCoverImagePath);
      if (book.cover_image_path) fs.unlink(path.join(uploadDir, book.cover_image_path), () => {});
    }
    if (pdfPath) {
      sql += ', pdf_path = ?';
      values.push(newPdfPath);
      if (book.pdf_path) fs.unlink(path.join(uploadDir, book.pdf_path), () => {});
    }

    sql += ' WHERE id = ?';
    values.push(id);

    db.query(sql, values, (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update book' });
      broadcastUpdate();
      res.json({ message: 'Book updated successfully' });
    });
  });
});

app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT cover_image_path, pdf_path FROM books WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch book' });
    if (results.length === 0) return res.status(404).json({ error: 'Book not found' });

    const book = results[0];
    if (book.cover_image_path) fs.unlink(path.join(uploadDir, book.cover_image_path), () => {});
    if (book.pdf_path) fs.unlink(path.join(uploadDir, book.pdf_path), () => {});

    db.query('DELETE FROM books WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to delete book' });
      broadcastUpdate();
      res.json({ message: 'Book deleted successfully' });
    });
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
