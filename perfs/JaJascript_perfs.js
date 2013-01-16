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

var input = require('./10AF123.json');

vows.describe('L\'entreprise location JaJascript de Martin O.').addBatch({
  ' test de performances avec une entrée importante ': {
    topic: (function(){
      console.time("vows-optim");
      return JaJascript(input).optimize()
    })(),
    'on répond {"gain":48,"path":["AF11","AF14","AF33","AF36","AF39","AF312","AF315","AF318","AF214","AF217"]}': 
      assertResult(48, ["AF11","AF14","AF33","AF36","AF39","AF312","AF315","AF318","AF214","AF217"])
  }
}).export(module);
