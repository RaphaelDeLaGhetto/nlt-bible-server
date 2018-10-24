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

  let browser, bible;

  beforeEach((done) => {
    browser = new Browser({ waitDuration: '30s', loadCss: false });

    importer(data, (err, results) => {
      if (err) {
        return done.fail(err);
      }
      bible = results;

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

  it('links to every book in the Bible', () => {
    browser.assert.text('article section p:nth-child(1)', bible[0].chapters[0].verses[0].number + bible[0].chapters[0].verses[0].text); 
    browser.assert.text('article section p:nth-child(1) sup', bible[0].chapters[0].verses[0].number); 
    browser.assert.text('article section p:nth-child(2)', bible[0].chapters[0].verses[1].number + bible[0].chapters[0].verses[1].text); 
    browser.assert.text('article section p:nth-child(2) sup', bible[0].chapters[0].verses[1].number); 
  });

  it('displays the chapter\'s contents', () => {
    browser.assert.text('article h1', 'Genesis 1');
  });

  it('displays a link to the next chapter', () => {
    browser.assert.link('a.next-chapter', 'next', '/Genesis/2');
  });

  it('does not display a link to the previous chapter', () => {
    browser.assert.elements('a.previous-chapter', 0);
  });
});
