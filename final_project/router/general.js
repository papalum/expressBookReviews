const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    const userExists = users.some(user => user.username === username);
  
    if (userExists) {
      return res.status(409).json({ message: "Username already exists." });
    }
  
    users.push({ username, password });
  
    return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
   res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const matchingBooks = [];

  const bookKeys = Object.keys(books);

  bookKeys.forEach(isbn => {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push({ isbn, ...books[isbn] });
    }
});

if (matchingBooks.length > 0) {
    res.status(200).json(matchingBooks);
  } else {
    res.status(404).json({ message: "No books found for the given author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase(); 
    const matchingBooks = [];
  
    const bookKeys = Object.keys(books);
  
    bookKeys.forEach(isbn => {
      if (books[isbn].title.toLowerCase() === title) {
        matchingBooks.push({ isbn, ...books[isbn] });
      }
    });
  
    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found with the given title" });
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    const book = books[isbn];
  
    if (book) {
      res.status(200).json(book.reviews);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });

module.exports.general = public_users;
