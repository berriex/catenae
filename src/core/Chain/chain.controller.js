var Chain = require('../../models/Chain.js');
var mongoose = require('mongoose');
// var Promise = require('bluebird');

module.exports = (app)=>{

  var getAll = function(req, res, next){
    if (!req.body.chain) return res.status(404).send('Missing property chain!');
    Chain.find().exec().then(function(chain){
      res.status(201).send({'chains' : chain});
      return next();
    }).catch(function(err){
      res.status(500).send('Internal Error Server');
      return next();
    });
  }

  var addChain = function(req, res, next){
    if (!req.body.chain) return res.status(404).send('Missing property chain!');
    let newChain = new Chain(req.body.chain);
    newChain.userId = req.user._id;
    newChain.save().then(function(entity){
      res.status(201).send(entity);
      return next();
    }).catch( function(err){
      return res.status(500).send('Missing parameter');
    });
  }

  var remove = function (req, res, next){
    if(!req.body.chain) return res.status(404).send('Missing property chain!');
    if(!req.body.chain._id) return res.status(404).send('Missing property _id');
    Chain.findByIdAndRemove({'_id':req.body.chain._id}).exec().then(function (){
        res.status(201).send("Chain remove");
        return next();
    }).catch( function(err){
        res.status(500).send("Fail delete chain")
        return next();
    })
  }

  var update = function(req, res, next){
    if(!req.body.chain) return res.status(404).send('Missing property chain!');
    if(!req.body.chain._id) return res.status(404).send('Missing property _id');
    Chain.findByIdAndUpdate({'_id':req.body.chain._id}, req.body.chain, {upsert: true}).exec().then(function(chain){
      res.status(201).send(chain);
      return next();
    }).catch(function(err){
      res.status(500).send('Fail Update');
      return next();
    })
  }

  var getSingleChain = function(req, res, next){
    if(!req.body.chain) return res.status(404).send('Missing property chain!');
    if(!req.body.chain._id) return res.status(404).send('Missing property _id');
    Chain.findById(req.body.chain._id).exec().then(function(chain){
      res.status(201).send({'chain' : chain});
      return next();
    }).catch(function(err){
      res.status(500).send('Fail Get');
      return next();
    })
  }

  return{
    getAll : getAll,
    addChain : addChain,
    remove : remove,
    update : update,
    getSingleChain : getSingleChain
  }
}

// curl -X GET -H 'Authorization: Bearer 50684f53063111e71779fc1ee4987bc76c770c2dabfeac0a15dd63f63a9bc92b' http://localhost:3000/v1/chain -v
//curl -X POST -H "Content-Type: application/json" -d '{"chain" : {"name":"Brian"}}' -H 'Authorization: Bearer 50684f53063111e71779fc1ee4987bc76c770c2dabfeac0a15dd63f63a9bc92b' http://localhost:3000/v1/chain -v
//curl -X GET -H "Content-Type: application/json" -d '{"chain" : {"_id":"57860630cd5cf79419d3ab1e"}}' -H 'Authorization: Bearer 50684f53063111e71779fc1ee4987bc76c770c2dabfeac0a15dd63f63a9bc92b' http://localhost:3000/v1/chain/577690c42a1afed8366c4905 -v
//curl -X PUT -H "Content-Type: application/json" -d '{"chain" : {"_id":"57860630cd5cf79419d3ab1e", "name":"Christian"}}' -H 'Authorization: Bearer 50684f53063111e71779fc1ee4987bc76c770c2dabfeac0a15dd63f63a9bc92b' http://localhost:3000/v1/chain/577690c42a1afed8366c4905 -v
//curl -X DELETE -H "Content-Type: application/json" -d '{"chain" : {"_id":"57860630cd5cf79419d3ab1e"}}' -H 'Authorization: Bearer 50684f53063111e71779fc1ee4987bc76c770c2dabfeac0a15dd63f63a9bc92b' http://localhost:3000/v1/chain/577690c42a1afed8366c4905 -v
