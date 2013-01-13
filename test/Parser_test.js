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
  },
  'l\'expresion (1+2+3+4+5+6+7+8+9+10)*2':{
    topic : Parser.evaluate('(1+2+3+4+5+6+7+8+9+10)*2',{}),
    'donne 110' : function(topic){
      assert.strictEqual(topic, 110);
    }
  },
  'l\'expresion  4267387833344334647677634 + 553344300034334349999000':{
    topic : Parser.evaluate('4267387833344334647677634 + 553344300034334349999000',{}),
    'donne un big integer' : function(topic){
      assert.ok( typeof topic != Number );
    },
    'donne 4820732133378668997676634' : function(topic){
      assert.strictEqual(topic.toPlainString(), '4820732133378668997676634');
    }
  },
  '((1.1+2)+3.14+4+(5+6+7)+(8+9+10)*4267387833344334647677634)/2*553344300034334349999000':{
    topic : Parser.evaluate('((1.1+2)+3.14+4+(5+6+7)+(8+9+10)*4267387833344334647677634)/2*553344300034334349999000',{}),
    'donne un big integer' : function(topic){
      assert.ok( typeof topic != Number );
      console.log(topic.toPlainString());
    },
    'donne 31878018903828899277492024491376690701584574504458.534162678249005000' : function(topic){
      assert.strictEqual(topic.toPlainString(), '31878018903828899277492024491376690701584574504458.534162678249005000');
    }
  }
}).export(module);