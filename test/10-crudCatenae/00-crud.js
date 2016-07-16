'use strict'

var chai = require('chai');
chai.should();
var request = require('superagent');
var Promise = require('bluebird');

var User = require('../../src/models/User')
var AccessToken = require('../../src/models/AccessToken')

var user, token, invalidToken, chainId, userId;

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
            token: 'AAAAAAAAAAAAAAAAAAAAAAA'
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
      .set('Authorization', 'Bearer '+ invalidToken.token)
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
        res.body.name.should.equal('Brian');
        res.body._id.should.be.not.empty;
        chainId = res.body._id;
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
        res.text.should.equal('Missing property chain!');
        return done();
      });
  });

  it('should reject a call with unvalid object | post', (done) => {
    request
      .post('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {}})
      .end(function(err, res){
        res.statusCode.should.equal(404);
        res.body.should.be.empty;
        res.text.should.equal('Missing property name!');
        return done();
      });
  });

  it('should accept a call with valid auth | get', (done) => {
    request
      .get('localhost:3000/v1/chain')
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {"id" : chainId }})
      .end(function(err, res){
        res.statusCode.should.equal(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('chains');
        res.body.chains.should.be.instanceof(Array);
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
      .get('localhost:3000/v1/chain/'+ chainId)
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {'_id' : chainId}})
      .end(function(err, res){
        res.statusCode.should.equal(201);
        res.should.be.json;
        res.body.chain.should.have.property('_id');
        res.body.chain.should.have.property('userId');
        res.body.chain.should.have.property('name');
        res.body.chain.should.have.property('created');
        res.body.chain._id.should.equal(chainId);
        res.body.chain._id.should.be.not.empty;
        return done();
      });
  });

  it('should reject a call with unvalid _id | getSingle', (done) => {
    request
      .get('localhost:3000/v1/chain/' + chainId)
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {}})
      .end(function(err, res){
        res.statusCode.should.equal(404);
        res.body.should.be.empty;
        res.text.should.equal('Missing property _id');
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
      .put('localhost:3000/v1/chain/' +chainId)
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {"_id": chainId, "name" : "Brian" }})
      .end(function(err, res){
        res.statusCode.should.equal(201);
        res.body.should.be.empty;
        res.text.should.equal('Chain updated');
        return done();
      });
  });

  it('should reject a call with unvalid _id | put', (done) => {
    request
      .put('localhost:3000/v1/chain/'+chainId)
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {}})
      .end(function(err, res){
        res.statusCode.should.equal(404);
        res.body.should.be.empty;
        res.text.should.equal('Missing property _id');
        return done();
      });
  });

  it('should reject a call with unvalid auth | put', (done) => {
    request
      .put('localhost:3000/v1/chain/'+chainId)
      .set('Authorization', 'Bearer INVALIDTOKEN')
      .send({"chain" : {"_id": chainId}})
      .end(function(err, res){
        res.statusCode.should.equal(401);
        res.body.should.be.empty;
        res.text.should.equal('Unauthorized');
        return done();
      });
  });

  it('should reject a call with valid auth | delete', (done) => {
    request
      .delete('localhost:3000/v1/chain/'+chainId)
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {'_id' : chainId}})
      .end(function(err, res){
        res.statusCode.should.equal(201);
        res.text.should.equal('Chain remove');
        return done();
      });
  });

  it('should reject a call with unvalid _id | delete', (done) => {
    request
      .delete('localhost:3000/v1/chain/'+chainId)
      .set('Authorization', 'Bearer ' + token.token)
      .send()
      .end(function(err, res){
        res.statusCode.should.equal(404);
        res.body.should.be.empty;
        res.text.should.equal('Missing property chain!');
        return done();
      });
  });

  it('should reject a call with unvalid _id | delete', (done) => {
    request
      .delete('localhost:3000/v1/chain/'+chainId)
      .set('Authorization', 'Bearer ' + token.token)
      .send({"chain" : {}})
      .end(function(err, res){
        res.statusCode.should.equal(404);
        res.body.should.be.empty;
        res.text.should.equal('Missing property _id');
        return done();
      });
  });

  it('should reject a call with unvalid auth | delete', (done) => {
    request
      .delete('localhost:3000/v1/chain/'+chainId)
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
});
