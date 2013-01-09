var vows = require('vows'), assert = require("assert"), Scalaskel = require('../lib/Scalaskel');

var assertValue = function(valeur){
  return function(topic){
     assert.equal(topic, valeur);
  };
};

var assertChange = function(valeur){
  return function(topic){
     //assert.equal(valeur, topic);
  };
};

vows.describe('Les groDessimaux de Scalaskel').addBatch({
  'Le Foo': {
    topic: Scalaskel.foo,
    'vaut 1 cent': assertValue(1),
  },
  'Le Bar': {
    topic: Scalaskel.bar,
    'vaut 7 cents': assertValue(7)
  },
  'Le Qix': {
    topic: Scalaskel.qix,
    'vaut 11 cents': assertValue(11)
  },
  'Le Baz': {
    topic: Scalaskel.baz,
    'vaut 21 cents': assertValue(21)
  }
}).addBatch({
  'le change de 7 ': {
    topic: new Scalaskel().change(7),
    'est "[ {"foo": 7}, {"bar": 1} ]"': assertChange([ {"foo": 7}, {"bar": 1} ])
  }
}).export(module);