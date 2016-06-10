'use strict'

var passport = require('passport');
var auth = require('../auth/auth');

module.exports = (app) => {

  // BLOCK CRUD
  app.route('/v1/block')
    .all( auth.bearer() )

    .get( (req, res, next) => {
      res.send({'uno': 'due'});
      return next();
    })

    .post( (req, res, next) => {
      res.send({'uno': 'due'});
      return next();
    })

    .put( (req, res, next) => {
      res.send({'uno': 'due'});
      return next();
    })

    .delete( (req, res, next) => {
      res.send({'uno': 'due'});
      return next();
    })

}
