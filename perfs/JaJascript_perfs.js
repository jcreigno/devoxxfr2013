var vows = require('vows'),
  assert = require("assert"),
  _ = require("underscore"),
  JaJascript = require('../lib/JaJascript');

function assertResult(gain, path) {
  return function(topic) {
    console.timeEnd("vows-optim");
    console.log(topic);
    assert.ok(topic);
    assert.equal(topic.gain, gain);
    assert.equal(topic.path.length, path.length);
    for (var i = 0; i < path.length; i++) {
      assert.equal(topic.path[i], path[i]);
    }
  };
}

function assertGain(gain) {
  return function(topic) {
    console.timeEnd("vows-optim");
    console.log(topic);
    assert.ok(topic);
    assert.equal(topic.gain, gain);
  };
}

var input = require('./10AF123.json');
var sample = require('./sample.json');

vows.describe('L\'entreprise location JaJascript de Martin O.').addBatch({
  ' test de performances avec une entrée importante ': {
    topic: (function(){
      console.time("vows-optim");
      return JaJascript(input).optimize()
    })(),
    'on répond {"gain":48,"path":["AF11","AF14","AF33","AF36","AF39","AF312","AF315","AF318","AF214","AF217"]}': 
      assertGain(48)
  },
  ' test de performances avec une vrai requête ': {
    topic: (function(){
      console.time("vows-optim");
      return JaJascript(sample).optimize()
    })(),
    'on trouve un gain 167':
      assertResult(167,
        ["important-warehouse-88", 
         "old-luggage-67", 
         "faint-sculpture-1", 
         "clever-frisbee-57", 
         "jolly-archery-8", 
         "lonely-ship-5", 
         "difficult-menthol-61", 
         "tired-rating-22", 
         "chubby-protein-48"]
      )
  }
}).export(module);
