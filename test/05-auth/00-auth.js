'use strict'

var chai = require('chai');
chai.should();
var request = require('superagent');
var Promise = require('bluebird');

var User = require('../../src/models/User')
var AccessToken = require('../../src/models/AccessToken')
// var server = require('../../src/server')

var user, token, invalidToken;

describe('User shoud be authenticated', () => {

  before( done => {
    var testuser = new User({
      username: 'test'
    })
    testuser.save().then( u => {

      user = u;

      var testtoken = new AccessToken({
          userId: user._id,
          token: 'QWERTYUIOPASDFGHJKLZXCVBNM'
      });

      testtoken.save().then( t => {
        token = t;
        var invalidUserToken = new AccessToken({
            userId: t._id, //just a mongoId
            token: 'AAAAAAAAAAAAAAAAAAAAAAAA'
        });
        invalidUserToken.save( function(err, t2){
          invalidToken = t2;
        });

        return done();
      })
    })
  });



  it('should reject a call without auth', (done) => {
    request
      .get('localhost:3000/profile')
      .end(function(err, res){
        res.statusCode.should.equal(401);
        res.body.should.be.empty;
        res.text.should.equal('Unauthorized');
        return done();
      });
  });

  it('should accept a call with valid auth', (done) => {
    request
      .get('localhost:3000/profile')
      .set('Authorization', 'Bearer ' + token.token)
      .end(function(err, res){
        res.statusCode.should.equal(200);
        res.body.username.should.equal(user.username);
        res.body.id.should.be.not.empty;
        return done();
      });
  });

  it('should reject a call with unvalid auth', (done) => {
    request
      .get('localhost:3000/profile')
      .set('Authorization', 'Bearer INVALIDTOKEN')
      .end(function(err, res){
        res.statusCode.should.equal(401);
        res.body.should.be.empty;
        res.text.should.equal('Unauthorized');
        return done();
      });
  });

  it('should reject a call with valid token but invalid user', (done) => {
    request
      .get('localhost:3000/profile')
      .set('Authorization', 'Bearer '+invalidToken.token)
      .end(function(err, res){
        res.statusCode.should.equal(401);
        res.body.should.be.empty;
        res.text.should.equal('Unauthorized');
        return done();
      });
  });

  after( done => {
    Promise.all([
      User.remove({_id: user._id}),
      AccessToken.remove({userId: user._id}),
      AccessToken.remove({token: invalidToken.token})
    ]).then( result => {
      return done();
    });
  });
})
