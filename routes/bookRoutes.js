const express = require('express');
const router = express.Router();

const Books = require('./../models/Books');
const{jwtAuthMiddleware , generateToken} = require('./../jwt');


// Add a new book (only Admin can add)
router.post('/add', jwtAuthMiddleware, async (req, res) => {
  try {

    console.log("Decoded user:", req.user);

    const userData = req.user; // decoded from JWT
    console.log("Decoded user:", userData);

    // Check if user is Admin
    if (userData.userType !== 'Admin') {
      return res.status(403).json({ message: "Access denied. Only Admins can add books." });
    }

    const { name, authorname, quantity } = req.body;

    if (!name || !quantity) {
      return res.status(400).json({ message: "Book name and quantity are required." });
    }

    // Check if book already exists
    let book = await Books.findOne({ name, authorname });

    if (book) {
      // Increase quantity if exists
      book.quantity += quantity;
      const updatedBook = await book.save();
      return res.status(200).json({
        message: `Book already exists, quantity increased by ${quantity}`,
        book: updatedBook,
      });
    }

    // Create new book if not exists
    const newBook = new Books({ name, authorname, quantity });
    const savedBook = await newBook.save();

    res.status(201).json({ message: "Book added successfully", book: savedBook });
  } catch (error) {
    console.error("Error adding book:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Sell a book (only sellers can sell)
router.post('/sell/:name', jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    console.log("Decoded user:", userData);

    if (userData.userType !== 'Seller') {
      return res.status(403).json({ message: "Access denied. Only sellers can sell books." });
    }

    const bookName = req.params.name;
    let { quantity = 1 } = req.body;
    quantity = Number(quantity); // ensure it is a number

    console.log("Selling book:", bookName, "Quantity:", quantity);

    if (!bookName || quantity <= 0) {
      return res.status(400).json({ message: "Invalid book name or quantity" });
    }

    // Case-insensitive search
    const book = await Books.findOne({ name: { $regex: new RegExp(`^${bookName}$`, 'i') } });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    book.quantity -= quantity;
    const updatedBook = await book.save();

    res.status(200).json({
      message: `${quantity} book(s) sold successfully`,
      book: updatedBook,
    });

  } catch (error) {
    console.error("Error selling book:", error); // log full error
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get all books
router.get('/all', async (req, res) => {
  try {
    const books = await Books.find();

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    res.status(200).json({ books });
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get book details by name
router.get('/name/:name', async (req, res) => {
  try {
    const bookName = req.params.name;

    const book = await Books.findOne({ name: bookName });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ book });
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




module.exports = router ;