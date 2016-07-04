'use strict'

var mongoose = require('mongoose');
var config = require('config');
mongoose.Promise = require('bluebird');

var params = config.get('database');
var db = {

  connect(){
    mongoose.connect(params.url);
  }

}

module.exports = db;
