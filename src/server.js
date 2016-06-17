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
var app = express();

var Server = {

  start(){
    /* istanbul ignore if */
    if( !process.env.NODE_ENV ){
      process.env.NODE_ENV = 'development';
    }


    db.connect();


    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(passport.initialize())

    //TODO: get those funcs to auth/something
    googleOAuth(app);
    githubAuth(app);

    routing(app);

    var env = config.get('env');
    var dbconf = config.get('database');
    let port = process.env.OPENSHIFT_NODEJS_PORT || env.port;
    let ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
    this.server = app.listen(port, ip, function() {
      process.title = pkg.name
      console.log(`${pkg.name}-v${pkg.version} is listening on port ${port}!
        - CONFIG  : ./config/${process.env.NODE_ENV}.json
        - DBURL   : ${dbconf.url}
        - PID     : ${process.pid}
        `);
    });
  },

  close(){
    db.close();
    this.server.close();
  }

}


module.exports = Server;
