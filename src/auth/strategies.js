'use strict'

var passport          = require('passport');
var BearerStrategy    = require('passport-http-bearer').Strategy;
var User              = require('../models/User')
var AccessToken       = require('../models/AccessToken');


passport.use(new BearerStrategy(
    function(accessToken, done) {
        AccessToken.findOne({ token: accessToken }, function(err, token) {
            if (err){
              return done(err);
            }
            if (!token){
              return done(null, false);
            }

            User.findById(token.userId, function(err, user) {
                if (err) {
                  return done(err);
                }
                if (!user){
                  return done(null, false, { message: 'Unknown user' });
                }

                var info = { scope: '*' }
                done(null, user, info);
            });
        });
    }
));
