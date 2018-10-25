'use strict';                  

const app = require('../../app'); 

const Browser = require('zombie');
const PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001; 

const db = require('../../models');
const importer = require('../../lib/importer');
const data = require('../data/nlt-sample.json');

Browser.localhost('example.com', PORT);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe('chapter navigation', () => {

  let browser, bible;

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


  beforeEach((done) => {
    browser = new Browser({ waitDuration: '30s', loadCss: false });

    browser.visit('/', (err) => {
      if (err) {
        return done.fail(err);
      }
      browser.assert.success();
      done();
    });
  });

  it('allows you to navigate the entire Bible from alpha to omega', done => {
    let chapterCount = 0;
    for (const book in data) {
      for (const chapter in data[book]) {
        chapterCount++;
      }
    }
    expect(chapterCount).toEqual(90);
    browser.assert.text('article h1', 'Genesis 1');

    function checkLinks(count) {
      count--;
      if (!count) {
        browser.assert.text('article h1', 'Revelation 22');
        return done();
      }
      browser.clickLink('next', err => {
        browser.assert.success()
        checkLinks(count);
      });
    }

    checkLinks(chapterCount);
  });

  it('allows you to navigate the entire Bible from omega to alpha', done => {
    let chapterCount = 0;
    for (const book in data) {
      for (const chapter in data[book]) {
        chapterCount++;
      }
    }
    expect(chapterCount).toEqual(90);

    browser.visit('/Revelation/22', err => {
      if (err) {
        return done.fail(err);
      }

      browser.assert.text('article h1', 'Revelation 22');
  
      function checkLinks(count) {
        count--;
        if (!count) {
          browser.assert.text('article h1', 'Genesis 1');
          return done();
        }
        browser.clickLink('prev', err => {
          browser.assert.success()
          checkLinks(count);
        });
      }
  
      checkLinks(chapterCount);
    });
  });

  it('doesn\'t barf if chapter doesn\'t exist', done => {
    browser.visit('/Revelation/23', err => {
      browser.assert.text('#message', 'Whatchoo talkin\' \'bout, Willis?');
      done();
    });
  });
});
