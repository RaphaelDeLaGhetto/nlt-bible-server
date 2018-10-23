'use strict';

module.exports = function(data, done) {
  const db = require('../models');
  
  const bookOrder = [
    'Genesis',
    'Exodus',
    'Leviticus',
    'Numbers',
    'Deuteronomy',
    'Joshua',
    'Judges',
    'Ruth',
    '1 Samuel',
    '2 Samuel',
    '1 Kings',
    '2 Kings',
    '1 Chronicles',
    '2 Chronicles',
    'Ezra',
    'Nehemiah',
    'Esther',
    'Job',
    'Psalms',
    'Proverbs',
    'Ecclesiastes',
    'Song of Solomon',
    'Isaiah',
    'Jeremiah',
    'Lamentations',
    'Ezekiel',
    'Daniel',
    'Hosea',
    'Joel',
    'Amos',
    'Obadiah',
    'Jonah',
    'Micah',
    'Nahum',
    'Habakkuk',
    'Zephaniah',
    'Haggai',
    'Zechariah',
    'Malachi',
    'Matthew',
    'Mark',
    'Luke',
    'John',
    'Acts',
    'Romans',
    '1 Corinthians',
    '2 Corinthians',
    'Galatians',
    'Ephesians',
    'Philippians',
    'Colossians',
    '1 Thessalonians',
    '2 Thessalonians',
    '1 Timothy',
    '2 Timothy',
    'Titus',
    'Philemon',
    'Hebrews',
    'James',
    '1 Peter',
    '2 Peter',
    '1 John',
    '2 John',
    '3 John',
    'Jude',
    'Revelation',
  ];
  
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
