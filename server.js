//  R'N'R   December 20, 2023

//DEPENDENCIES
require("dotenv").config(); //using our .env variable

require("./config/db")  //bring our db connection

const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");  //added DELETE capability


const app = express();

const { PORT = 3013 } = process.env;

//importing Book model
const Book = require("./models/book");



//MIDDLEWARE
app.use(morgan("dev")) // logging
app.use(express.urlencoded({ extended: true })) // body parser this is how we get access to req.body
app.use(methodOverride("_method"))  //lets us use DELETE PUT HTTP verbs


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


//Delete route
app.delete("/books/:id", async (req, res) => {
    try {
        // Find a book and then delete
        let deletedBook = await Book.findByIdAndDelete(req.params.id)
        console.log(deletedBook)
        // redirect back to the index
        res.redirect("/books")
    } catch (error) {
        res.status(500).send("something went wrong when deleting")
    }
})


//Edit route
app.get("/books/edit/:id", async (req, res) => {
    try {
        // find the book to edit
        let foundBook = await Book.findById(req.params.id)
        res.render("edit.ejs", {
            book: foundBook
        })
    } catch (error) {
        res.send("hello from the error")
    }
})


//UPDATE Route
app.put("/books/:id", async (req, res) => {

    try {
        // handle our checkbox
        if (req.body.completed === "on") {
            req.body.completed = true
        } else {
            req.body.completed = false
        }
        // Then find by id and update with the req.body
        // findByIdAndUpdate - id , data to update, options
        let updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        )

        // redirect to the show route with the updated book
        res.redirect(`/books/${updatedBook._id}`)

    } catch (error) {
        res.send("something went wrong in this route")
    }
})

//SEED ROUTE / DEFAULT / ROUTE
app.get("/books/seed", async (req, res) => {
    try {
        // delete everything in the database
        await Book.deleteMany({})
        // Create data in the database
        await Book.create(
            [
                {
                  title: "Cracking the Coding Interview",
                  author: "Gayle Laakmann McDowell",
                },
                {
                  title: "HTML and CSS: Design and Build Websites",
                  author: "Jon Duckett",
                },
                {
                  title: "JavaScript and JQuery: Interactive Front-End Web Development ",
                  author: "jon Duckett",
                },
                {
                  title: "You Don't Know JS Yet",
                  author: "Kyle Simpson",
                },
                {
                  title:
                    "Design Patterns: Elements of Reusable Object-Oriented Software ",
                  author: "Erich Gamma",
                },
                {
                  title: "Frontend Unicorn",
                  author:
                    "Michał Malewicz, Szymon Adamiak, Albert Pawłowski, and Albert Walicki",
                },
                {
                  title: "Don't Make Me Think",
                  author: "Steve Krug",
                },
              ]
        )
        // redirect back to the index
        res.redirect("/books")
    } catch (error) {
        res.send("something went wrong with your seeds")
    }
})

//Show - GET rendering only one book *** SHOW
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