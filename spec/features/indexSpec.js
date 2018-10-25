'use strict';                  

const app = require('../../app'); 

const Browser = require('zombie');
const PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001; 

const db = require('../../models');
const importer = require('../../lib/importer');
const data = require('../data/nlt-sample.json');
const bookTitles = require('../../lib/books');

Browser.localhost('example.com', PORT);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe('index', () => {

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

  it('displays the book name and chapter', () => {
    browser.assert.text('article h1', 'Genesis 1');
  });

  it('shows chapter content', () => {
    browser.assert.text('article section p:nth-child(1)', bible[0].chapters[0].verses[0].number + bible[0].chapters[0].verses[0].text); 
    browser.assert.text('article section p:nth-child(1) sup', bible[0].chapters[0].verses[0].number); 
    browser.assert.text('article section p:nth-child(2)', bible[0].chapters[0].verses[1].number + bible[0].chapters[0].verses[1].text); 
    browser.assert.text('article section p:nth-child(2) sup', bible[0].chapters[0].verses[1].number); 
  });

  it('links to every book in the Bible', () => {
    browser.assert.element('details#books')
    browser.assert.text('details#books summary', 'All Books')
    browser.assert.elements('details#books p a', 66)

    for (const title of bookTitles) {    
      browser.assert.link('details#books p a', title, `/${title.replace(/ /g, "_")}`);
    }
  });

  it('displays a link to the next chapter', () => {
    browser.assert.link('a.next-chapter', 'next', '/Genesis/2');
  });

  it('does not display a link to the previous chapter', () => {
    browser.assert.elements('a.previous-chapter', 0);
  });

  it('only displays copy on the first page', done => {
    browser.assert.element('.copy');
    browser.clickLink('next', err => {
      if (err) {
        done.fail();
      }
      browser.assert.success();
      browser.assert.elements('.copy', 0);
      done();
    });
  });


});
