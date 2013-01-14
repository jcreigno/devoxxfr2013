var _ = require('underscore');

function State(path, unaffected, gain) {
  this.path = path || [];
  this.unaffected = unaffected || [];
  this.gain = gain || 0;
}


function JaJascript(flights) {
  this.flights = flights;
}

JaJascript.prototype.optimize = function() {
  var self = this;
  var allPath = self.findAvaliablePaths([new State([], self.flights)]);
  var max = _.max(allPath, function(s) {
    return s.gain;
  });
  return {
    'gain': max.gain,
    'path': _.map(max.path, function(p) {
      return p.VOL;
    })
  };
};

function makeChildren(state) {
  var results = [];
  for (var i = 0; i < state.unaffected.length; i++) {
    var flight = state.unaffected[i];
    //pas besoin de vérifier les vols antérieurs ou simultanés...
    var filtered = _.filter(state.unaffected.slice(i + 1), function(f) {
      return f.DEPART >= (flight.DEPART + flight.DUREE);
    });
    results.push(new State(state.path.concat(flight), filtered, state.gain + flight.PRIX));
  }
  return results;
}

JaJascript.prototype.findAvaliablePaths = function(stack) {
  var results = [];
  while (stack.length > 0) {
    var state = stack.pop();
    //console.log(state);
    if (state.unaffected.length === 0) {
      results.push(state);
    } else {
      stack = stack.concat(makeChildren(state));
    }
  }
  return results;
};

module.exports = function(flights) {
  return new JaJascript(flights);
};