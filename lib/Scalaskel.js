var _ = require('underscore');

function Scalaskel() {

}

module.exports = function() {
  return new Scalaskel();
};
var cents = [{
  name: 'foo',
  value: 1
}, {
  name: 'bar',
  value: 7
}, {
  name: 'qix',
  value: 11
}, {
  name: 'baz',
  value: 21
}];
_.each(cents, function(item) {
  module.exports[item.name] = item.value;
});

Scalaskel.prototype.change = function(groDessimal) {
  return this.decompose(groDessimal, cents.slice());
};

Scalaskel.prototype.decompose = function(groDessimal, factors) {
  var self = this;
  var result = [];
  if (groDessimal === 0) {
    return result;
  }
  if (groDessimal === 1) {
    return [{
      'foo': 1
    }];
  }

  var f;
  while (f = factors.pop()) {
    if (groDessimal < f.value) {
      continue;
    }
    var quotien = Math.floor(groDessimal / f.value);
    var reste = groDessimal % f.value;
    if (reste === 0 && quotien === 1) {
      //console.log('pushing {%s:%d}', f.name, quotien);
      result.push(coin(f.name, quotien));
    }
    else {
      //console.log('%d = %d x %d + %d', groDessimal, f.value, quotien, reste);
      var partials = createPartialResults(f, quotien);
      partials.forEach(function(partial) {
        var r = reste + ((quotien - _.values(partial)[0]) * f.value);
        console.log('reste à decomposer %d', r);
        if(r === 0){
          result.push(coin(f.name, quotien));
        }else{
          var s = merge(partial, self.decompose(r, factors.slice()));
          result = result.concat(s);
        }
      });
    }
  }
  return result;
};

function merge(result, others) {
  var name = _.keys(result)[0];
  var value = _.values(result)[0];
  others.forEach(function(o) {
    if (o[name]) {
      o[name] += value;
    }
    else {
      o[name] = value;
    }
  });
  console.log(others);
  return others;
}

function createPartialResults(f, quotien) {
  if (f.name == 'foo') { // pas possible de décomposer plus.
    return [coin(f.name, quotien)];
  }
  var c = [];
  for (var i = quotien; i >= 1; i--) {
    c.push(coin(f.name, i));
  }
  return c;
}

function coin(name, value) {
  var r = {};
  r[name] = value;
  return r;
}
