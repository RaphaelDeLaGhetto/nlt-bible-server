'use strict';

const importer = require('../lib/importer');
const data = require('./NLT.json');

importer(data, (err, results) => {
  if (err) {
    console.error(err);
    process.exit(0);
  }
  console.log('Cheerio!\n');
  process.exit(0);
});
