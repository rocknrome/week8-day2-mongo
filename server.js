//  R'N'R   December 20, 2023

//DEPENDENCIES
require("dotenv").config(); //using our .env variable

require("./config/db")  //bring our db connection

const express = require("express");
const morgan = require("morgan");


const app = express();

const { PORT = 3013 } = process.env;

//importing Book model
const Book = require("./models/book");



//MIDDLEWARE
app.use(morgan("dev")) // logging
app.use(express.urlencoded({ extended: true })) // body parser this is how we get access to req.body


//ROUTES

// Index - GET render all of the books
app.get("/books", async (req, res) => {
    // find all of the books
    let books = await Book.find({})

    // render all of the books to index.ejs
    res.render("index.ejs", {
        books: books.reverse()
    })
})


//New - GET for the form to create a new book
app.get("/books/new", (req, res) => {
    res.render("new.ejs")
})


// Create - POST
app.post("/books", async (req, res) => {
    try {
        if (req.body.completed === "on") {
            // if checked
            req.body.completed = true
        } else {
            // if not checked
            req.body.completed = false
        }

        let newBook = await Book.create(req.body)
        res.redirect("/books")

    } catch (err) {
        res.send(err)
    }
})

//Show - GET rendering only one book
app.get("/books/:id", async (req, res) => {
    // find a book by _id
    let foundBook = await Book.findById(req.params.id) // the request params object
    // render show.ejs with the foundBook
    res.render("show.ejs", {
        book: foundBook
    })
})


app.listen(PORT, () => {
    console.log(`I am alive on port ${PORT}`);
})