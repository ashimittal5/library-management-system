import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // 👈 Import the CSS file

const App = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/books");
      setBooks(response.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const addBook = async () => {
    try {
      await axios.post("http://localhost:5000/books", {
        title,
        author,
        published_date: publishedDate,
      });
      fetchBooks();
      resetForm();
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  const updateBook = async () => {
    try {
      await axios.put(`http://localhost:5000/books/${editId}`, {
        title,
        author,
        published_date: publishedDate,
      });
      fetchBooks();
      resetForm();
    } catch (err) {
      console.error("Error updating book:", err);
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const startEdit = (book) => {
    setEditId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setPublishedDate(formatDate(book.published_date));
  };

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setAuthor("");
    setPublishedDate("");
  };

  return (
    <div className="container">
      <header>
        <h1>📚 Library Management System</h1>
      </header>

      <div className="form-card">
        <h2>{editId ? "Edit Book" : "Add a New Book"}</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="date"
          value={publishedDate}
          onChange={(e) => setPublishedDate(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="primary" onClick={editId ? updateBook : addBook}>
            {editId ? "Update Book" : "Add Book"}
          </button>
          {editId && (
            <button className="secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="card-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <h3>{book.title}</h3>
            <p>by {book.author}</p>
            <p>Published: {formatDate(book.published_date)}</p>
            <div className="flex gap-2 mt-2">
              <button className="secondary" onClick={() => startEdit(book)}>
                Edit
              </button>
              <button className="danger" onClick={() => deleteBook(book.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
