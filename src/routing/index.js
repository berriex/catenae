'use strict'

var passport = require('passport');
var pkg = require('../../package.json');
var auth = require('../auth/auth');

let block = require('./block');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.json({ 'app': pkg.name, 'ver': pkg.version});
  });

  app.get('/profile', auth.bearer(), (req, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username
    });
  });

  app.get('/auth/error', auth.bearer(), (req, res) => {
    res.json({
      req: req
    });
  });

  block(app);
}
