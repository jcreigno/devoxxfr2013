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

vows.describe('L\'entreprise location JaJascript de Martin O.').addBatch({
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
  ' avec l\'exemple de l\'énoncé dans le désordre ': {
    topic: JaJascript([{
      "VOL": "LEGACY01",
      "DEPART": 5,
      "DUREE": 9,
      "PRIX": 8
    }, {
      "VOL": "MONAD42",
      "DEPART": 0,
      "DUREE": 5,
      "PRIX": 10
    }, {
      "VOL": "YAGNI17",
      "DEPART": 5,
      "DUREE": 9,
      "PRIX": 7
    }, {
      "VOL": "META18",
      "DEPART": 3,
      "DUREE": 7,
      "PRIX": 14
    }]).optimize(),
    'on obtient le même résultat': assertResult(18, ["MONAD42", "LEGACY01"])
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