'use strict';

module.exports = function(mongoose) {
  const Schema = mongoose.Schema;
  const Types = Schema.Types;
  const uniqueValidator = require('mongoose-unique-validator');

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
