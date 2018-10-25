const express = require('express');
const router = express.Router();
const db = require('../models');
const bookTitles = require('../lib/books');

/**
 * GET home page.
 */
router.get('/', function(req, res, next) {
  db.Book.findOne({ name: 'Genesis' }).then(book => {
    res.render('index', { book: book, chapter: 0, bookTitles: bookTitles });
  }).catch(err => {
    console.log(err);
    res.status(500).send()
  });
});

/**
 * GET /:book
 */
router.get('/:book', function(req, res, next) {
  db.Book.findOne({ name: req.params.book.replace(/_/g, ' ') }).then(book => {
    res.render('index', { book: book, chapter: 0, bookTitles: bookTitles });
  }).catch(err => {
    console.log(err);
    res.status(500).send()
  });
});

/**
 * GET /:book/:chapter
 */
router.get('/:book/:chapter', function(req, res, next) {
  db.Book.findOne({ name: req.params.book.replace(/_/g, ' ') }).then(book => {
    res.render('index', { book: book,
                          chapter: req.params.chapter === 'end' ? book.chapters.length - 1: req.params.chapter - 1,
                          bookTitles: bookTitles });
  }).catch(err => {
    console.log(err);
    res.status(500).send()
  });
});


module.exports = router;
