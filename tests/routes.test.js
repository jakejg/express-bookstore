const request = require("supertest");
const Book = require("../models/book");
const app = require("../app");
const db = require("../db");

process.env.NODE_ENV = "test";

describe("Auth Routes Test", function () {
let goodData;
let badData;
let goodBook;


    beforeEach(async function () {
        await db.query("DELETE FROM books");

        goodData = {
          "isbn": "0691161518",
          "amazon_url": "http://a.co/eobPtX2",
          "author": "Matthew Lane",
          "language": "english",
          "pages": 264,
          "publisher": "Princeton University Press",
          "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
          "year": 2017
        }   

        badData = {
          "isbn": "0691161518",
          "amazon_url": "http://a.co/eobPtX2",
          "author": "Matthew Lane",
          "language": "english",
          "pages": 264,
          "publisher": "Princeton University Press",
          "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
          "year": "2017"
        }   
        goodBook = await Book.create(goodData);

    });

    describe("GET", function () {
        test("can get all books", async function () {
            let res = await request(app).get("/books");
            expect(res.statusCode).toEqual(200);
            expect(res.body.books).toEqual(expect.any(Array));
            expect(res.body.books.length).toEqual(1);

        });
        test("can get a book", async function () {
            let res = await request(app).get(`/books/${goodBook.isbn}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ 
                "book": {
                    "isbn": "0691161518",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Matthew Lane",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                }
            });
        });
    });

    describe("POST", function () {
        test("can create a book w/ good data", async function () {
            // change isbn data so we don't get duplicate p-key error
            goodData.isbn = "0989078687"
            let res = await request(app)
                .post("/books")
                .send(goodData);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({
                book: {
                    isbn: '0989078687',
                    amazon_url: 'http://a.co/eobPtX2',
                    author: 'Matthew Lane',
                    language: 'english',
                    pages: 264,
                    publisher: 'Princeton University Press',
                    title: 'Power-Up: Unlocking the Hidden Mathematics in Video Games',
                    year: 2017
                }
            });
        });
        test("get an error creating book w/ bad data", async function () {
            let res = await request(app)
                .post("/books")
                .send(badData);
            expect(res.statusCode).toEqual(400);
            expect(res.body.error.message).toEqual(['instance.year is not of a type(s) integer']);
        });
    });

    describe("/PUT", function(){
        test("get an error updating book w/ bad data", async function () {
            badData.pages = "264"
            let res = await request(app)
                .put(`/books/${badData.isbn}`)
                .send(badData);
            expect(res.statusCode).toEqual(400);
            expect(res.body.error.message[0]).toEqual('instance.pages is not of a type(s) integer');
            expect(res.body.error.message[1]).toEqual('instance.year is not of a type(s) integer');
        });
    });

    describe("/DELETE", function(){
        test("can delete a book", async function () {
            let res = await request(app)
                .delete(`/books/${goodBook.isbn}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({message: "Book deleted"});

        });
    });
});

afterAll(async function () {
    await db.end();
  });