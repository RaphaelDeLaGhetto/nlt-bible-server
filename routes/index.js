const express = require('express');
const router = express.Router();
const db = require('../models');

/**
 * GET home page.
 */
router.get('/', function(req, res, next) {
  db.Book.findOne({ name: 'Genesis' }).then(book => {
    res.render('index', { book: book, chapter: 0 });
  }).catch(err => {
    console.log(err);
    res.status(500).send()
  });
});

module.exports = router;
