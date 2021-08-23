require('dotenv').config();
const { request, response } = require("express");
const express = require("express");
const mongoose = require("mongoose");

// database
const Database = require("./database");


mongoose.connect(  process.env.MONGO_URI ,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => console.log("connection extablished!"))
    .catch((err) => {
        console.log(err);
    });

// initialization
const OurAPP = express();

OurAPP.use(express.json());

OurAPP.get("/", (request,response) => {
    response.json({message: "server is working!!!!!!!!"});
});


// Route    - /book
// Des      - To get all books
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
OurAPP.get("/book",(req , res) => {
return res.json({books:Database.Book});
});


// Route    - /book/:bookID
// Des      - To get a book based on ISBN
// Access   - Public
// Method   - GET
// Params   - bookID
// Body     - none
OurAPP.get("/book/:bookID",(req , res) => {
 const getBook = Database.Book.filter((book) => book.ISBN === req.params.bookID);

    return res.json({book: getBook});
    });
// Route    - /book/c/:category
// Des      - to get a list of books based on category
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none
OurAPP.get("/book/c/:category",(req , res) => {
    const getBook = Database.Book.filter((book) => book.category.includes (req.params.category));
   
       return res.json({book: getBook});
       });

       

// Route    - /book/c/:author
// Des      - to get a list of books based on author
// Access   - Public
// Method   - GET
// Params   - author
// Body     - none
OurAPP.get("/book/c/:authors",(req , res) => {
    const getBook = Database.Book.filter((book) => book.authors.includes (req.params.authors));
   
       return res.json({book: getBook});
 });
      
       //route          /book/new
       //description     add new book
       //access          public
       //parameters      none
       //method          post
       OurAPP.post("/book/new", (req , res) => {
        console.log(req.body);
        return res.json({ message: "book added successfully"});
       });


     
       // route         /author/new
       //description    add new author
       //access         public
       //parameters     none
       //method         post
       OurAPP.post("/author/new", (req , res) => {
           const {newAuthor} = req.body;

          console.log(newAuthor);

       return res.json({message: "author was added!"});
       }); 



 // publication 
       // route         /publication/new
       //description    add new author
       //access         public
       //parameters     none
       //method         post
       OurAPP.post("/publication/new", (req , res) => {
          const publication = req.body;

          console.log(publication);
          return res.json({ message: "publication added"});
       });

// update a book 
       // route         /book/update/:isbn 
       //description    update a book 
       //access         public
       //parameters     isbn
       //method         put
       OurAPP.put("/book/update/:isbn" , (req , res) => {
        const {updateBook } = req.body;
        const {isbn} = req.params;

        const book = Database.Book.map((book) => {
         if (book.ISBN === isbn) {
             console.log({ ...book, ...updateBook });
             return { ...book, ...updateBook }
         }
         return book;
        });
           return res.json(book);
       });



      // route        /book/update
      //description   update/add new author to a book 
      //access        public
      //parameters    isbn
      //method        put
       OurAPP.put("/bookAuthor/update/:isbn" , (req , res) => {
        const {newAuthor} = req.body;
        const {isbn} = req.params;

        const book = Database.Book.map((book) => {
         if (book.ISBN === isbn) {
             if(!book.authors.includes(newAuthor)){
                 return book.authors.push(newAuthor);
             }
             return book;
         }
         return book;
        });
        const author = Database.Author.map((author) => {
           if(author.id === newAuthor) {
               if(!author.book.includes(isbn)){
                 return author.books.push(isbn);
               }
               return author
           }

        });
        return res.json({book: book, author: author});
        });
           
// task :--->
     // route        /author/update
      //description   update any details of the author
      //access        public
      //parameters    id
      //method        put
      OurAPP.put("/author/update/:id" , (req , res) => {
        const {updateAuthor} = req.body;
        const {id} = req.params;

       const author =  Database.Author.map((author) => {
            if(author.id === parseInt(id)){
                return {...author, ...updateAuthor }

            }
            return author;
        });
          
        return res.json(author);

      });


/*
Route               /book/delete/:isbn
Description         delete a book
Access              PUBLIC
Parameters          isbn
Method              DELETE
*/
OurAPP.delete("/book/delete/:isbn", (req, res) => {
    const { isbn } = req.params;

    const filteredBooks = Database.Book.filter((book) => book.ISBN !== isbn);

    Database.Book = filteredBooks;

    return res.json(Database.Book);
});

/*
Route                   /book/delete/author
Description             delte an author from a book
Access                  PUBLIC
Parameters              id, isdn
Method                  DELETE
*/
OurAPP.delete("/book/delete/author/:isbn/:id", (req, res) => {
    const { isbn, id } = req.params;

    //updating book database object
    Database.Book.forEach((book) => {
        if (book.ISBN === isbn) {
            if (!book.authors.includes(parseInt(id))) {
                return;
            }

            book.authors = book.authors.filter(
                (databaseId) => databaseId !== parseInt(id)
            );
            return book;
        }
        return book;
    });

    Database.Author.forEach((author) => {
        if (author.id === parseInt(id)) {
            if (!author.books.includes(isbn)) {
                return;
            }

            author.books = author.books.filter((book) => book !== isbn);

            return author;
        }
        return author;
    });

    return res.json({ book: Database.Book, author: Database.Author });
});

/*
Route               /author/delete
Description         delete an author
Access              PUBLIC
Parameters          id
Method              DELETE
*/
OurAPP.delete("/author/delete/:id", (req, res) => {
    const { id } = req.params;

    const filteredAuthors = Database.Author.filter(
        (author) => author.id !== parseInt(id)
    );

    Database.Author = filteredAuthors;

    return res.json(Database.Author);
});

/*
Route               /publication/delete
Description         delete an publication
Access              PUBLIC
Parameters          id
Method              DELETE
*/
OurAPP.delete("/publication/delete/:id", (req, res) => {
    const { id } = req.params;

    const filteredPub = Database.Publication.filter(
        (pub) => pub.id !== parseInt(id)
    );

    Database.Publication = filteredPub;

    return res.json(Database.Publication);
});

/*
Route               /publication/delete/book
Description         delete an book from a publication
Access              PUBLIC
Parameters          id, isbn
Method              DELETE
*/
OurAPP.delete("/publication/delete/book/:isbn/:id", (req, res) => {
    const { isbn, id } = req.params;

    Database.Book.forEach((book) => {
        if (book.ISBN === isbn) {
            book.publication = 0;
            return book;
        }
        return book;
    });

    Database.Publication.forEach((publication) => {
        if (publication.id === parseInt(id)) {
            const filteredBooks = publication.books.filter(
                (book) => book !== isbn
            );
            publication.books = filteredBooks;
            return publication;
        }
        return publication;
    });

    return res.json({ book: Database.Book, publication: Database.Publication });
});


// localhost:3000

OurAPP.listen(400,() => console.log("server is running")); 