'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Unit = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  blockId: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Unit', Unit);
