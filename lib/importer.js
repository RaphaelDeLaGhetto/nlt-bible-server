'use strict';

module.exports = function(data, done) {
  const db = require('../models');
  const bookOrder = require('./books');
  
  let books = [];
  
  for (const bookName of bookOrder) {
    let book = { name: bookName, chapters: [] };
  
    // Order chapters
    for (let i = 1; i <= Object.keys(data[bookName]).length; i++) {
      book.chapters.push({ number: i, verses: [] });
  
      // Order verses
      for (let j = 1; j <= Object.keys(data[bookName][i]).length; j++) {
  
        // If a verse is blank or undefined, it was probably merged into a
        // single verse in the translation
        if (data[bookName][i][j]) {
          book.chapters[book.chapters.length - 1].verses.push({ number: j, text: data[bookName][i][j] });
        }
        else {
          book.chapters[book.chapters.length - 1].verses.number = `${j-1}-${j}`;
        }
      }
    }
  
    books.push(book);
  }
  
  db.Book.db.dropDatabase().then((err, result) => {
    db.Book.insertMany(books).then(results => {
      done(null, results); 
    }).catch(err => {
      done(err); 
    });
  }).catch(err => {
    done(err); 
  });
}
