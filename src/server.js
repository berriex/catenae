'use strict'

var express = require('express');
var passport = require('passport');
var pkg = require('../package.json');
var bodyParser = require('body-parser');
var config = require('config');

var strategies = require('./auth/strategies');
var googleOAuth = require('./auth/google');
var githubAuth = require('./auth/github');
var routing = require('./routing');
var db = require('./db');

var Server = {

  start(){
    if( !process.env.NODE_ENV ){
      process.env.NODE_ENV = 'development';
    }


    db.connect();

    var app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(passport.initialize())

    //TODO: get those funcs to auth/something
    googleOAuth(app);
    githubAuth(app);

    routing(app);

    var env = config.get('env');
    var dbconf = config.get('database');

    app.listen( process.env.PORT || env.port, function() {
      process.title = pkg.name
      // console.log(`${pkg.name}-v${pkg.version} is listening on port ${env.port}!
      //   - CONFIG  : ./config/${process.env.NODE_ENV}.json
      //   - DBURL   : ${dbconf.url}
      //   - PID     : ${process.pid}
      //   `);
    });
  }

}


module.exports = Server;