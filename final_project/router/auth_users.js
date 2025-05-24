const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
  
    let accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });
  
    req.session.authorization = {
      accessToken,
      username
    };
  
    return res.status(200).json({ message: "Login successful", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization ? req.session.authorization.username : null;
  
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review text is required in query parameter" });
    }
  
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!book.reviews) {
      book.reviews = {};
    }
  
    book.reviews[username] = review;
  
    return res.status(200).json({ message: "Review added/updated successfully", reviews: book.reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization ? req.session.authorization.username : null;
  
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "Review by this user not found" });
    }
  
    delete book.reviews[username];
  
    return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
