const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Registro de usuario (Tarea 6)
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Tarea 10: Obtener todos los libros usando async/await con Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  }
});

// Tarea 11: Obtener detalles del libro por ISBN usando Promesas / async-await con Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
    .then(book => res.status(200).send(book))
    .catch(err => res.status(404).json({ message: err }));
});

// Tarea 12: Obtener detalles del libro por Autor usando async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const matchingBooks = await Promise.resolve(
      Object.values(books).filter(book => book.author === author)
    );
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Tarea 13: Obtener detalles del libro por Título usando async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const matchingBooks = await Promise.resolve(
      Object.values(books).filter(book => book.title === title)
    );
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// Tarea 5: Obtener reseñas del libro por ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn].reviews);
});

module.exports.general = public_users;
