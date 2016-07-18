'use strict'

var passport = require('passport');
var auth = require('../auth/auth');
var Chain = require('../core/Chain/chain.controller.js')();
module.exports = (app) => {
  // CHAIN CRUD ALL
  app.route('/v1/chain')
    .all( auth.bearer() )

    .get( Chain.getAll )

    .post( Chain.addChain );

    // CHAIN CRUD SINGLE
  app.route('/v1/chain/:id')
    .all( auth.bearer() )

    .get( Chain.getSingleChain )

    .put( Chain.update)

    .delete( Chain.remove )
}
