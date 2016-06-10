'use strict'

var passport          = require('passport');
var BearerStrategy    = require('passport-http-bearer').Strategy;
var User              = require('../models/User')
var AccessToken       = require('../models/AccessToken');


passport.use(new BearerStrategy(
    function(accessToken, done) {
        AccessToken.findOne({ token: accessToken }).then( token => {

            if (!token){
              return done(null, false);
            }

            User.findById(token.userId).then( user => {
                if (!user){
                  return done(null, false, { message: 'Unknown user' });
                }

                var info = { scope: '*' }
                return done(null, user, info);
            });
        });
    }
));
