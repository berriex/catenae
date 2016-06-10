'use strict'

var passport = require('passport');
var pkg = require('../../package.json');
var auth = require('../auth/auth');

let block = require('./block');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.json({ 'app': pkg.name, 'ver': pkg.version});
  });

  app.get('/whoami', auth.bearer(), (req, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username
    });
  });

  block(app);
}
