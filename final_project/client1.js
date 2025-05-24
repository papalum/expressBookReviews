const axios = require('axios');

const action = process.argv[2];   
const value = process.argv[3];   

if (!action) {
  const getBooksAsync = async () => {
    try {
      const response = await axios.get('http://localhost:5001/');
      console.log("📚 All books retrieved:");
      console.log(response.data);
    } catch (error) {
      console.error("❌ Error retrieving books:", error.message);
    }
  };
  getBooksAsync();
} else if (action === "isbn" && value) {
  const getBookByISBN = async (isbn) => {
    try {
      const response = await axios.get(`http://localhost:5001/isbn/${isbn}`);
      console.log(`📘 Book with ISBN ${isbn}:`);
      console.log(response.data);
    } catch (error) {
      console.error(`❌ Error retrieving book with ISBN ${isbn}:`, error.message);
    }
  };
  getBookByISBN(value);
} else if (action === "author" && value) {
  const getBooksByAuthor = async (author) => {
    try {
      const response = await axios.get(`http://localhost:5001/author/${encodeURIComponent(author)}`);
      console.log(`📕 Books by author "${author}":`);
      console.log(response.data);
    } catch (error) {
      console.error(`❌ Error retrieving books by author "${author}":`, error.message);
    }
  };
  getBooksByAuthor(value);
} else if (action === "title" && value) {
  const getBooksByTitle = async (title) => {
    try {
      const response = await axios.get(`http://localhost:5001/title/${encodeURIComponent(title)}`);
      console.log(`📗 Books with title "${title}":`);
      console.log(response.data);
    } catch (error) {
      console.error(`❌ Error retrieving books with title "${title}":`, error.message);
    }
  };
  getBooksByTitle(value);
} 
