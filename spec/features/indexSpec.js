'use strict';                  

const app = require('../../app'); 

const Browser = require('zombie');
const PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001; 

const db = require('../../models');
const importer = require('../../lib/importer');
const data = require('../data/nlt-sample.json');

Browser.localhost('example.com', PORT);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('index', () => {

  let browser;

  beforeEach((done) => {
    browser = new Browser({ waitDuration: '30s', loadCss: false });

    importer(data, (err, results) => {
      if (err) {
        return done.fail(err);
      }

      browser.visit('/', (err) => {
        if (err) {
          return done.fail(err);
        }
        browser.assert.success();
        done();
      });
    });
  });

  afterEach(done => {
    db.mongoose.connection.db.dropDatabase().then((err, result) => {
      done();
    }).catch(err => {
      done.fail(err);
    });
  });

  it('displays the book name and chapter', () => {
    browser.assert.text('article h1', 'Genesis 1');
  });

  it('displays a book menu', () => {
//    browser.assert.text('article h1', 'Genesis 1');
  });
});


