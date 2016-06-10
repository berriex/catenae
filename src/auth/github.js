var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var config = require('config');
var crypto = require('crypto');

var User = require('../models/User');
var AccessToken = require('../models/AccessToken');

var githubAuth  = app => {
  var github = config.get('authenticator.github');


  passport.use(new GitHubStrategy({
    clientID: github.clientID,
    clientSecret: github.clientSecret,
    callbackURL: github.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ provider: 'github', providerId: profile.id }, (err, user) => {
      if( err ) { return done(err, null); }

      if( !user ){
        var newuser = new User({
             username: profile.username,
             provider: 'github',
             providerId: profile.id
         });
         newuser.save((err, u) => {
             if (err) console.log(err);
             return done(err, u);
         });
      } else {
        return done(err, user);
      }

      return done(err, user);
    });
  }
));

app.get('/auth/github', passport.authenticate('github', { scope : ['user:email'], session: false  }));
app.get('/auth/github/callback',
          passport.authenticate('github', { failureRedirect: '/', session: false }),
          ( req, res, done) =>{
            var tokenValue = crypto.randomBytes(32).toString('hex');
            var token = new AccessToken({
                token: tokenValue,
                userId: req.user.id
              });
              token.save((err, t) =>{
                if (err){
                  return done(err);
                }
                res.status(201).send({
                  accessToken: t.token
                })
                return done();
              });
          });

}




module.exports = githubAuth;
