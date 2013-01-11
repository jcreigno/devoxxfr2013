var assert = require("assert")
  , vows = require('vows')
  , Parser = require("../lib/Parser").Parser;

vows.describe('L\'evaluateur d\'expression arithmetiques').addBatch({
  'l\' addition 2+3 ':{
    topic: Parser.evaluate('(2 + 3)', {}),
    'donne 5': function(topic){
      assert.strictEqual(topic, 5);
    }
  },
  'la multiplication 2*3':{
    topic: Parser.evaluate('2 * 3', {}),
    'donne 6' : function(topic){
      assert.strictEqual(topic, 6);
    }
  },
  'la soustraction 2-3':{
    topic: Parser.evaluate('2 - 3', {}),
    'donne -1' : function(topic){
      assert.strictEqual(topic, -1);
    }
  },
  'la division 4/2':{
    topic: Parser.evaluate('4/2', {}),
    'donne 2' : function(topic){
      assert.strictEqual(topic, 2);
    }
  },
  'l\'expression (1+2)*2':{
    topic : Parser.evaluate('(1+2)*2',{}),
    'donne 6' : function(topic){
      assert.strictEqual(topic, 6);
    }
  }
}).export(module);