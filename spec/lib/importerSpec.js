'use strict';

/**
 * 2018-10-23
 *
 * These tests were written after I decoupled the functionality from the 
 * simple database seed script I had written. I'm embarrassed to say,
 * test coverage may be inadequate in many cases. Tests will be written
 * as the need arises
 */
describe('importer', () => {
  const importer = require('../../lib/importer');
  const orderedBooks = require('../../lib/books');
  const db = require('../../models');
  const data = require('../data/nlt-sample.json');

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    db.mongoose.connection.db.dropDatabase().then((err, result) => {
      done();
    }).catch(err => {
      done.fail(err);
    });
  });

  it('adds the correct number of books, chapters, and verses to the database', done => {
    importer(data, (err, books) => {
      if (err) {
        return done.fail(err);
      }
      expect(books.length).toEqual(Object.keys(data).length);

      for (const book of books) {
        expect(book.chapters.length).toEqual(Object.keys(data[book.name]).length);
        
        for (const chapter of book.chapters) {
          expect(chapter.verses.length).toEqual(Object.keys(data[book.name][chapter.number]).length);
        }
      }

      done();
    });
  });


});
