// app.js
console.log('Starting application...');

const express = require('express');
const cors = require("cors");
const mysql = require('mysql2');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ashi',
  database: 'library_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// GET all books
app.get('/books', (req, res) => {
  connection.query('SELECT * FROM books', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// POST a new book
app.post('/books', (req, res) => {
  const { title, author, published_date } = req.body;
  const sql = 'INSERT INTO books (title, author, published_date) VALUES (?, ?, ?)';
  connection.query(sql, [title, author, published_date], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId, title, author, published_date });
  });
});

// PUT update a book (with logs)
app.put('/books/:id', (req, res) => {
  const { title, author, published_date } = req.body;
  const { id } = req.params;

  console.log("Received PUT request");
  console.log("ID:", id);
  console.log("Data:", { title, author, published_date });

  const sql = 'UPDATE books SET title = ?, author = ?, published_date = ? WHERE id = ?';
  connection.query(sql, [title, author, published_date, id], (err, result) => {
    if (err) {
      console.error("Error updating book:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Book updated successfully" });
  });
});

// DELETE a book
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM books WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Book deleted successfully' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
