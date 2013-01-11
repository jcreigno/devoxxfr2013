var vows = require('vows'),
  assert = require("assert"),
  _ = require("underscore"),
  Scalaskel = require('../lib/Scalaskel');

var assertValue = function(valeur) {
  return function(topic) {
    assert.equal(topic, valeur);
  };
};

var assertChange = function(valeur) {
  return function(topic) {
    console.log('result is %s', JSON.stringify(topic));
    assert.equal(JSON.stringify(valeur), JSON.stringify(topic));
  };
};

// vérifie que la somme de la décomposition
var assertSum = function(valeur) {
  return function(topic) {
    topic.forEach(function(t) {
      var sum = 0;
      _.keys(t).forEach(function(k) {
        sum += (Scalaskel[k] * t[k]);
      });
      assert.equal(sum, valeur);
    });
  };
};
vows.describe('Les groDessimaux de Scalaskel').addBatch({
  'Le Foo': {
    topic: Scalaskel.foo,
    'vaut 1 cent': assertValue(1)
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
  'le change de 1 ': {
    topic: new Scalaskel().change(1),
    'est "[ {"foo": 1}]"': assertChange([{
      "foo": 1
    }])
  },
  'le change de 6 ': {
    topic: new Scalaskel().change(6),
    'est "[ {"foo": 6} ]': assertChange([{
      "foo": 6
    }]),
    'la somme fait bien 6': assertSum(6)
  },
  'le change de 7 ': {
    topic: new Scalaskel().change(7),
    'est "[ {"foo": 7}, {"bar": 1} ]"': assertChange([{
      "bar": 1
    }, {
      "foo": 7
    }]),
    'la somme fait bien 7': assertSum(7)
  },
  'le change de 11 ': {
    topic: new Scalaskel().change(11),
    'est "[...]"': assertChange([{
      "qix": 1
    }, {
      "foo": 4,
      "bar": 1
    }, {
      "foo": 11
    }]),
    'la somme fait bien 11': assertSum(11)
  },
  'le change de 19 ': {
    topic: new Scalaskel().change(19),
    'est "[...]"': assertChange([{
      "foo": 1,
      "bar": 1,
      "qix": 1
    }, {
      "foo": 8,
      "qix": 1
    }, {
      "foo": 5,
      "bar": 2
    }, {
      "foo": 12,
      "bar": 1
    }, {
      "foo": 19
    }]),
    'la somme fait bien 19': assertSum(19)
  },
  'le change de 21 ': {
    topic: new Scalaskel().change(21),
    'est "[ {"foo": 7}, {"bar": 1} ]"': assertChange([{
      "baz": 1
    }, {
      "foo": 3,
      "bar": 1,
      "qix": 1
    }, {
      "foo": 10,
      "qix": 1
    }, {
      "bar": 3
    }, {
      "foo": 7,
      "bar": 2
    }, {
      "foo": 14,
      "bar": 1
    }, {
      "foo": 21
    }]),
    'la somme fait bien 21': assertSum(21)
  },
  'le change de 47 ': {
    topic: new Scalaskel().change(47),
    'la somme des chacune des décomposition fait bien 47': assertSum(47)
  }
}).export(module);