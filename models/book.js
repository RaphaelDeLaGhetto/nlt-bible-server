'use strict';

module.exports = function(mongoose) {
  const Schema = mongoose.Schema;
  const Types = Schema.Types;
  const uniqueValidator = require('mongoose-unique-validator');
  const bookOrder = require('../lib/books');

  /**
   * Verse
   */
  const VerseSchema = new Schema({
    number: {
      type: Types.String,
      trim: true,
      required: [true, 'No verse number supplied'],
    },
    text: {
      type: Types.String,
      trim: true,
      required: [true, 'No verse text supplied'],
      empty: [false, 'No verse text supplied']
    }
  });

  /**
   * Chapter
   */
  const ChapterSchema = new Schema({
    number: {
      type: Types.Number,
      required: [true, 'No chapter number supplied'],
    },
    verses: [VerseSchema],
  });

  /**
   * To aid with navigation
   */
  ChapterSchema.methods.next = function() {
    const chapIndex = this.parent().chapters.findIndex(chapter => chapter._id === this._id);

    if (chapIndex + 2 > this.parent().chapters.length) {
      const bookIndex = bookOrder.findIndex(book => book === this.parent().name);

      if (bookIndex + 2 > bookOrder.length) {
        return null;
      }

      return `/${bookOrder[bookIndex+1].replace(/ /g, "_")}/1`;
    }

    return `/${this.parent().name.replace(/ /g, "_")}/${chapIndex+2}`;
  }

  ChapterSchema.methods.previous = function() {
    const chapIndex = this.parent().chapters.findIndex(chapter => chapter._id === this._id);

    if (!chapIndex) {
      const bookIndex = bookOrder.findIndex(book => book === this.parent().name);

      if (bookIndex - 1 < 0 ) {
        return null;
      }

      return `/${bookOrder[bookIndex-1].replace(/ /g, "_")}/end`;
    }

    return `/${this.parent().name.replace(/ /g, "_")}/${chapIndex}`;
  }

  /**
   * Book
   */
  const BookSchema = new Schema({
    name: {
      type: Types.String,
      trim: true,
      required: [true, 'No book name supplied'],
      empty: [false, 'No book name supplied'],
      unique: true,
    },
    chapters: [ChapterSchema],
  });

  BookSchema.plugin(uniqueValidator);

  return BookSchema;
};
