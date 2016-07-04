'use strict'

var passport = require('passport');
var auth = require('../auth/auth');
var Chain = require('../core/Chain/chain.controller.js')();
module.exports = (app) => {
  // CHAIN CRUD ALL
  app.route('/v1/chain')
    .all( auth.bearer() )

    .get( (req, res, next) => {
      // res.json(Chain.getAll(req, res));
      Chain.getAll(req, res).then(function(chain){
        res.status(201).json(chain);
      }).catch(function(err, message){
        return res.status(err).send(message);
      });
      return next();
    })

    .post( (req, res, next) => {
      res.json(Chain.addChain(req, res));
      return next();
    })

    // CHAIN CRUD SINGLE
  app.route('/v1/chain/:id')
    .all( auth.bearer() )

    .get( (req, res, next) => {
      res.json(Chain.getSingleChain(req, res));
      return next();
    })

    .put( (req, res, next) => {
      res.json(Chain.update(req, res));
      return next();
    })

    .delete( (req, res, next) => {
      res.json(Chain.remove(req, res));
      return next();
    })
}
