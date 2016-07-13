'use strict'

var chai = require('chai');
chai.should();
var request = require('superagent');
var Promise = require('bluebird');

var User = require('../../src/models/User')
var AccessToken = require('../../src/models/AccessToken')
// var server = require('../../src/server')

var user, token, invalidToken;

var chainId = 5770d44f2e057af80f5a817c;
var userId = 'aaa' //TODO

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
      .get('localhost:3000/v1/chain')
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

  it('should create a chain', (done) => {
    request
      .post('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {"name":"Brian"}})
      .end(function(err, res){
        res.statusCode.should.equal(201);
        res.body.chain.name.should.equal('Brian');
        res.body.chain.id.should.be.not.empty;
        return done();
      });
  });

  it('should reject a call create chain | post', (done) => {
    request
      .post('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer INVALIDTOKEN')
      .end(function(err, res){
        res.statusCode.should.equal(401);
        res.body.should.be.empty;
        res.text.should.equal('Unauthorized');
        return done();
      });
  });

  it('should reject a call with unvalid object | post', (done) => {
    request
      .post('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer ' + token.token)
      .end(function(err, res){
        res.statusCode.should.equal(404);
        res.body.should.be.empty;
        res.text.should.equal('Chain not found!');
        return done();
      });
  });

  it('should reject a call with unvalid object | post', (done) => {
    request
      .post('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {}})
      .end(function(err, res){
        res.statusCode.should.equal(500);
        res.body.should.be.empty;
        res.text.should.equal('Missing parameter');
        return done();
      });
  });

  it('should accept a call with valid auth | get', (done) => {
    request
      .get('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer ' + token.token)
      .end(function(err, res){
        res.should.have.status(201);
        res.should.be.json;
        res.body[0].body.should.be.a('object');
        res.body[0].should.have.property('chain');
        res.body[0].chain.be.a('object');
        res.body[0].chain.should.have.property('_id');
        res.body[0].chain.should.have.property('useId');
        res.body[0].chain.should.have.property('name');
        res.body[0].chain.should.have.property('created');
        res.body[0].chain.id.should.be.not.empty;
        return done();
      });
  });

  it('should reject a call with unvalid auth | get', (done) => {
    request
      .get('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer INVALIDTOKEN')
      .end(function(err, res){
        res.statusCode.should.equal(401);
        res.body.should.be.empty;
        res.text.should.equal('Unauthorized');
        return done();
      });
  });

  it('should accept a call with valid auth | getSingle', (done) => {
    request
      .get('localhost:3000/v1/chain'+ chainId)
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {'_id' : '5770d44f2e057af80f5a817c'}})
      .end(function(err, res){
        res.should.have.status(201);
        res.should.be.json;
        res.body[0].body.should.be.a('object');
        res.body[0].should.have.property('chain');
        res.body[0].chain.be.a('object');
        res.body[0].should.chain.have.property('_id');
        res.body[0].should.chain.have.property('useId');
        res.body[0].should.chain.have.property('name');
        res.body[0].should.chain.have.property('created');
        res.body[0]._id.should.equal('5770d44f2e057af80f5a817c');
        res.body[0].chain._id.should.be.not.empty;
        return done();
      });
  });

  it('should reject a call with unvalid _id | getSingle', (done) => {
    request
      .get('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {'_id' : 'null'}})
      .end(function(err, res){
        res.statusCode.should.equal(404);
        res.body.should.be.empty;
        res.text.should.equal('Chain not found!');
        return done();
      });
  });

  it('should reject a call with unvalid auth | getSingle', (done) => {
    request
      .get('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer INVALIDTOKEN')
      .send({"chain" : {'_id' : 'null'}})
      .end(function(err, res){
        res.statusCode.should.equal(401);
        res.body.should.be.empty;
        res.text.should.equal('Unauthorized');
        return done();
      });
  });

  it('should reject a call with valid auth | put', (done) => {
    request
      .put('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {"name":"Brian"}})
      .end(function(err, res){
        res.body[0].should.have.status(201);
        res.body[0].should.be.json;
        res.body[0].body.should.be.a('object');
        res.body[0].body.should.have.property('chain');
        res.body[0].body.chain.should.be.a('object');
        res.body[0].body.chain.should.have.property('name');
        res.body[0].body.chain.name.should.have.property('Brian');
        res.body[0].chain.id.should.be.not.empty;
        return done();
      });
  });

  it('should reject a call with unvalid _id | put', (done) => {
    request
      .put('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {"name":"Brian"}})
      .end(function(err, res){
        res.statusCode.should.equal(404);
        res.body.should.be.empty;
        res.text.should.equal('Chain not found!');
        return done();
      });
  });

  it('should reject a call with unvalid auth | put', (done) => {
    request
      .put('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer INVALIDTOKEN')
      .send({"chain" : {"name":"Brian"}})
      .end(function(err, res){
        res.statusCode.should.equal(401);
        res.body.should.be.empty;
        res.text.should.equal('Unauthorized');
        return done();
      });
  });

  it('should reject a call with valid auth | delete', (done) => {
    request
      .delete('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {'_id' : '5770d44f2e057af80f5a817c'}})
      .end(function(err, res){
        res.body[0].should.have.status(201);
        res.body[0].should.be.json;
        res.body[0].body.should.be.a('object');
        res.body[0].body.should.have.property('chain');
        res.body[0].body.chain.should.be.a('object');
        res.body[0].body.chain.should.have.property('name');
        res.body[0].body.chain.should.have.property('_id');
        res.body[0].body.chain.name.should.have.property('Brian');
        res.body[0].body.chain._id.should.have.property('5770d44f2e057af80f5a817c');
        res.body[0].chain._id.should.be.not.empty;
        return done();
      });
  });

  it('should reject a call with unvalid _id | delete', (done) => {
    request
      .delete('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {'_id' : 'null'}})
      .end(function(err, res){
        res.statusCode.should.equal(404);
        res.body.should.be.empty;
        res.text.should.equal('Chain not found!');
        return done();
      });
  });

  it('should reject a call with unvalid auth | delete', (done) => {
    request
      .delete('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer INVALIDTOKEN')
      .send({"chain" : {'_id' : 'null'}})
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
