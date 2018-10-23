'use strict';

describe('Book', () => {
  const db = require('../../models');
  const Book = db.Book;

  /**
   * Model must haves
   * `undefined` values actually test for membership. I don't know why this
   * works. Try adding a pair that isn't part of the schema. See test below.
   */
  let required;

  beforeEach(done => {
    required = {
      name: 'Genesis',
    };

    done();
  });

  afterEach(done => {
    db.mongoose.connection.db.dropDatabase().then((err, result) => {
      done();
    }).catch(err => {
      done.fail(err);
    });
  });

  describe('basic validation', () => {
    it('initializes the object with the correct key/value pairs', () => {
      let book = new Book(required);
      // Believe it or not, the `undefined` values actually work to
      // verify schema membership (see `required` def above)
      expect(book).toEqual(jasmine.objectContaining(required));
    });

    it('does not allow an empty \'name\' field', done => {
      delete required.name;
      Book.create(required).then((obj) => {
        done.fail('This should not have saved');
      }).catch(error => {
        expect(Object.keys(error.errors).length).toEqual(1);
        expect(error.errors.name.message).toEqual('No book name supplied');
        done();
      });
    });

    it('does not allow a duplicate \'name\' field', done => {
      Book.create(required).then(obj => {
        Book.create(required).then(obj => {
          done.fail('This should not have saved');
        }).catch(error => {
          expect(Object.keys(error.errors).length).toEqual(1);
          expect(error.errors.name.message).toEqual('Error, expected `name` to be unique. Value: `Genesis`');
          done();
        });
      }).catch(error => {
        done.fail(error);
      });
    });

    it('initializes the object with the correct key/value pairs', () => {
      let book = new Book({ name: "Genesis" });
      // Believe it or not, the `undefined` values actually work to
      // verify schema membership
      const expected = {
        name: 'Genesis',
      };

      expect(book).toEqual(jasmine.objectContaining(expected));
      // Product options array
      expect(book.chapters.length).toEqual(0);
    });
  });

  describe('chapters', () => {

    let book;
    beforeEach(() => {
      book = new Book({ name: "Genesis" });
    });

    it('adds a chapter', done => {
      expect(book.chapters.length).toEqual(0);
      book.chapters.push({ number: 1 });
      book.save().then(results => {
        Book.findById(book._id).then(results => {
          expect(book.chapters.length).toEqual(1);
          expect(book.chapters[0].number).toEqual(1);
          expect(book.chapters[0].verses.length).toEqual(0);
          done();
        }).catch(err => {
          done.fail(err);
        });
      }).catch(err => {
        done.fail(err);
      });
    });

    it('requires a chapter number', done => {
      expect(book.chapters.length).toEqual(0);
      book.chapters.push({});
      book.save().then(results => {
        done.fail('This should not have saved');
      }).catch(err => {
        expect(err.errors['chapters.0.number'].message).toEqual('No chapter number supplied');
        done();
      });
    });

    describe('chapters', () => {
      beforeEach(done => {
        book.chapters.push({ number: 1 });
        book.save().then(results => {
          book = results;
          done();
        }).catch(err => {
          done.fail(err);
        });
      });
  
      it('adds a verse', done => {
        expect(book.chapters[0].verses.length).toEqual(0);
        book.chapters[0].verses.push({ number: 1, text: 'In the beginning God created the heavens and the earth.' });
        book.save().then(results => {
          Book.findById(book._id).then(results => {
            expect(book.chapters[0].verses.length).toEqual(1);
            expect(book.chapters[0].verses[0].number).toEqual('1');
            expect(book.chapters[0].verses[0].text).toEqual('In the beginning God created the heavens and the earth.');
            done();
          }).catch(err => {
            done.fail(err);
          });
        }).catch(err => {
          done.fail(err);
        });
      });
  
      it('requires a verse number', done => {
        expect(book.chapters[0].verses.length).toEqual(0);
        book.chapters[0].verses.push({ text: 'In the beginning God created the heavens and the earth.' });
        book.save().then(results => {
          done.fail('This should not have saved');
        }).catch(err => {
          expect(err.errors['chapters.0.verses.0.number'].message).toEqual('No verse number supplied');
          done();
        });
      });

      it('requires verse text', done => {
        expect(book.chapters[0].verses.length).toEqual(0);
        book.chapters[0].verses.push({ number: 1 });
        book.save().then(results => {
          done.fail('This should not have saved');
        }).catch(err => {
          expect(err.errors['chapters.0.verses.0.text'].message).toEqual('No verse text supplied');
          done();
        });
      });

      it('allows hyphenated verse numbers', done => {
        const text = 'In the beginning God created the heavens and the earth. The earth was formless and empty, and darkness covered the deep waters. And the Spirit of God was hovering over the surface of the waters.';
        expect(book.chapters[0].verses.length).toEqual(0);
        book.chapters[0].verses.push({ number: '1-2',
                                       text: text });
        book.save().then(results => {
          Book.findById(book._id).then(results => {
            expect(book.chapters[0].verses.length).toEqual(1);
            expect(book.chapters[0].verses[0].number).toEqual('1-2');
            expect(book.chapters[0].verses[0].text).toEqual(text);
            done();
          }).catch(err => {
            done.fail(err);
          });
        }).catch(err => {
          done.fail(err);
        });
      });
    });
  });
});
