'use strict'

var express = require('express');
var app = express();
var passport = require('passport');
var pkg = require('./package.json');
var bodyParser = require('body-parser');
var config = require('config');

var strategies = require('./src/auth/strategies');
var googleOAuth = require('./src/auth/google');
var githubAuth = require('./src/auth/github');
var routing = require('./src/routing');


if( !process.env.NODE_ENV ){
  process.env.NODE_ENV = 'development';
}

var db = require('./src/db');
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize())

googleOAuth(app);
githubAuth(app);

routing(app);

var env = config.get('env');
var dbconf = config.get('database');

app.listen(env.port, function() {
  process.title = pkg.name
  console.log(`${pkg.name}-v${pkg.version} is listening on port ${env.port}!
    - CONFIG  : ./config/${process.env.NODE_ENV}.json
    - DBURL   : ${dbconf.url}
    - PID     : ${process.pid}
    `);
});
