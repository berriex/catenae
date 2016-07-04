var Chain = require('../../models/Chain.js');
var mongoose = require('mongoose');
// var Promise = require('bluebird');

module.exports = (app)=>{

  var getAll = function(req, res){
    Chain.find().exec().then(function(chain){
      // console.log(chain);
      return res.status(201).send({'chain' : chain});
    }).catch(function(err){
      return res.status(500).send('Internal Error Server');
    });
  }

  var addChain = function(req, res){
    if(!req.body.chain) return res.send(403, 'Chain not found!');
    let newChain = new Chain(req.body.chain);
    newChain.userId = req.user._id;
    newChain.save().then(function(entity){
      console.info(entity);
      return res.status(201).send(entity);
    }).catch( function(err){
      return res.status(500);
    });
  }

  var remove = function (req, res){
    Chain.findByIdAndRemove(req.body.id).exec().then(function (){
        res.status(201).send("Chain remove");
    }).catch( function(err){
        res.status(500).send("ControllerCalendar: fail delete appointments")
    })
  }

  var update = function(req, res){
    Chain.findByIdAndUpdate(req.body.chain._id).exec().then(function(chain){
      res.send(200).status('Updated');
    }).catch(function(err){
      res.status(500).send('Fail Update');
    })
  }

  var getSingleChain = function(req, res){
    Chain.findByIdAndUpdate(req.body.chain._id).exec().then(function(chain){
      res.send(200).status({'chain' : chain});
    }).catch(function(err){
      res.status(500).send('Fail Update');
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


//curl -X POST -H "Content-Type: application/json" -d '{"chain" : {"name":"Brian"}}' -H 'Authorization: Bearer 50684f53063111e71779fc1ee4987bc76c770c2dabfeac0a15dd63f63a9bc92b' http://localhost:3000/v1/chain
//curl -X GET -H "Content-Type: application/json" -d '{"chain" : {"_id":"577690c42a1afed8366c4905,"}}' -H 'Authorization: Bearer 50684f53063111e71779fc1ee4987bc76c770c2dabfeac0a15dd63f63a9bc92b' http://localhost:3000/v1/chain
