var vows = require('vows'),
  assert = require("assert"),
  _ = require("underscore"),
  JaJascript = require('../lib/JaJascript');

function assertResult(gain, path) {
  return function(topic) {
    console.log(topic);
    assert.ok(topic);
    assert.equal(topic.gain, gain);
    assert.equal(topic.path.length, path.length);
    for (var i = 0; i < path.length; i++) {
      assert.equal(topic.path[i], path[i]);
    }
  };
}

vows.describe('L\'entreprise location JaJascript de Martin O.')
.addBatch({
  'avec un nouvel objet Jajascript':{
    topic: JaJascript([{
      "VOL": "MONAD42",
      "DEPART": 4,
      "DUREE": 5,
      "PRIX": 10
    },{
      "VOL": "MONAD43",
      "DEPART": 4,
      "DUREE": 5,
      "PRIX": 10
    }, {
      "VOL": "META18",
      "DEPART": 3,
      "DUREE": 7,
      "PRIX": 14
    }, {
      "VOL": "LEGACY01",
      "DEPART": 5,
      "DUREE": 9,
      "PRIX": 8
    }, {
      "VOL": "YAGNI17",
      "DEPART": 1,
      "DUREE": 9,
      "PRIX": 7
    }]),
    'les vols sont triés dans l\'objet par ordre de DEPART': function(topic){
      var expected = [1,3,4,4,5];
      for(var i=0;i<expected.length;i++){
        assert.equal(topic.flights[i].DEPART, expected[i]);
      }
    }
  }
})
.addBatch({
  ' avec l\'exemple de l\'énoncé ': {
    topic: JaJascript([{
      "VOL": "MONAD42",
      "DEPART": 0,
      "DUREE": 5,
      "PRIX": 10
    }, {
      "VOL": "META18",
      "DEPART": 3,
      "DUREE": 7,
      "PRIX": 14
    }, {
      "VOL": "LEGACY01",
      "DEPART": 5,
      "DUREE": 9,
      "PRIX": 8
    }, {
      "VOL": "YAGNI17",
      "DEPART": 5,
      "DUREE": 9,
      "PRIX": 7
    }]).optimize(),
    'on répond { gain: 18, path: [ \'MONAD42\', \'LEGACY01\' ] }': assertResult(18, ["MONAD42", "LEGACY01"])
  },
  ' avec un exemple plus compliqué ': {
    topic: JaJascript([{
      "VOL": "LEGACY01",
      "DEPART": 0,
      "DUREE": 4,
      "PRIX": 8
    }, {
      "VOL": "MONAD42",
      "DEPART": 0,
      "DUREE": 3,
      "PRIX": 10
    }, {
      "VOL": "YAGNI17",
      "DEPART": 4,
      "DUREE": 9,
      "PRIX": 7
    }, {
      "VOL": "META18",
      "DEPART": 4,
      "DUREE": 6,
      "PRIX": 14
    },{
      "VOL": "LEGACY02",
      "DEPART": 2,
      "DUREE": 9,
      "PRIX": 8
    }, {
      "VOL": "MONAD43",
      "DEPART": 10,
      "DUREE": 5,
      "PRIX": 14
    }, {
      "VOL": "YAGNI18",
      "DEPART": 14,
      "DUREE": 7,
      "PRIX": 7
    }, {
      "VOL": "META19",
      "DEPART": 6,
      "DUREE": 7,
      "PRIX": 12
    }]).optimize(),
    'on obtient le même résultat': assertResult(38 , [ 'MONAD42', 'META18', 'MONAD43'])
  },
  'avec le premier exemple {"VOL": "AF514", "DEPART":0, "DUREE":5, "PRIX": 10}': {
    topic: JaJascript([{
      "VOL": "AF514",
      "DEPART": 0,
      "DUREE": 5,
      "PRIX": 10
    }]).optimize(),
    'on répond AF514 ': assertResult(10, ["AF514"])
  }
}).export(module);
