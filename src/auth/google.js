'use strict'

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('config');
var crypto = require('crypto');

var User = require('../models/User');
var AccessToken = require('../models/AccessToken');

var googleOAuth = app => {
  var google = config.get('authenticator.google');

  passport.use(new GoogleStrategy({
                clientID: google.clientID,
                clientSecret: google.clientSecret,
                callbackURL: google.callbackURL
              },
              (accessToken, refreshToken, profile, done) => {
                /* istanbul ignore next */
                User.findOne({ provider: 'google', providerId: profile.id }, function (err, user) {
                  if( err ) {
                    return done(err, null);
                  }

                  if( !user ){
                    var newuser = new User({
                         username: profile.emails[0].value,
                         provider: 'google',
                         providerId: profile.id
                     });
                     newuser.save().then( u => {
                         return done(err, u);
                     });
                  } else {
                    return done(err, user);
                  }
                });
              })
            );


  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false  }));
  app.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/auth/google', session: false }),
            /* istanbul ignore next */
            function( req, res, done){
              var tokenValue = crypto.randomBytes(32).toString('hex');
              var token = new AccessToken({
                  token: tokenValue,
                  userId: req.user.id
                });
              token.save().then( (t) => {
                return res.status(201).json({
                  accessToken: t.token
                })
              });

            }
          );

}


module.exports = googleOAuth;
