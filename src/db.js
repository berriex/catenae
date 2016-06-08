var mongoose = require('mongoose');
var config = require('config');

var params = config.get('database');
var db = {

  connect(){
    mongoose.connect(params.url);
  }

}

module.exports = db;
