'use strict';                  

const app = require('../../app'); 

const Browser = require('zombie');
const PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001; 

const db = require('../../models');
const importer = require('../../lib/importer');
const data = require('../data/nlt-sample.json');

Browser.localhost('example.com', PORT);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe('book navigation', () => {

  let browser, bible, bookTitles;

  beforeAll(done => {
    importer(data, (err, results) => {
      if (err) {
        return done.fail(err);
      }
      bible = results;
      done();
    });
  });

  afterAll(done => {
    db.mongoose.connection.db.dropDatabase().then((err, result) => {
      done();
    }).catch(err => {
      done.fail(err);
    });
  });


  beforeEach(done => {
    // Slice creates a shallow copy for when the test modifies the object
    bookTitles = require('../../lib/books').slice();

    browser = new Browser({ waitDuration: '30s', loadCss: false });
    browser.visit('/', (err) => {
      if (err) {
        return done.fail(err);
      }
      browser.assert.success();
      done();
    });
  });

  it('allows you to access every book from the main nav', done => {
    browser.assert.element('details#books');

    function checkLinks(bookTitles) {
      if (!bookTitles.length) {
        return done();
      }
      let title = bookTitles.shift();

      browser.clickLink(title, err => {
        browser.assert.success()
        browser.assert.text('article h1', `${title} 1`);
        checkLinks(bookTitles);
      });
    }

    checkLinks(bookTitles);
  });

});
