import { useState, useEffect } from "react";
import "./App.css";

const BASE_URL = import.meta.env.VITE_API_URL;

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState(0);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/books/`);
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addBook = async () => {
    const bookData = {
      title,
      release_year: releaseYear,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/books/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json();

      if (response.ok) {
        setBooks((prev) => [...prev, data]);
      } else {
        console.log("Error:", data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateTitle = async (pk, release_year) => {
    const bookData = {
      title: newTitle,
      release_year,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/books/${pk}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json();

      if (response.ok) {
        setBooks((existingBooks) =>
          existingBooks.map((book) =>
            book.id === pk ? data : book
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBook = async (pk) => {
    try {
      const response = await fetch(`${BASE_URL}/api/books/${pk}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBooks((existingBooks) =>
          existingBooks.filter((book) => book.id !== pk)
        );
      } else {
        console.log("Failed to delete book");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h1 className="heading">📚 Book Management System</h1>

      <div className="add-book">
        <input
          type="text"
          value={title}
          placeholder="Book Title..."
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          value={releaseYear}
          placeholder="Release Year..."
          onChange={(e) => setReleaseYear(e.target.value)}
        />

        <button
          className="add-btn"
          onClick={async () => {
            await addBook();
            setTitle("");
            setReleaseYear(0);
          }}
        >
          Add Book
        </button>
      </div>

      <div className="book-list">
        {books.map((book) => (
          <div className="book-card" key={book.id}>
            <h2>{book.title}</h2>

            <p>
              <strong>Release Year:</strong> {book.release_year}
            </p>

            <input
              type="text"
              value={newTitle}
              placeholder="Enter New Title"
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <div className="button-group">
              <button
                className="update-btn"
                onClick={async () => {
                  await updateTitle(book.id, book.release_year);
                  setNewTitle("");
                }}
              >
                Update
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteBook(book.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;