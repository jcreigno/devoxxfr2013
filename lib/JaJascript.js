var _ = require('underscore');

function State(path, unaffected, gain) {
  this.path = path || [];
  this.unaffected = unaffected || [];
  this.gain = gain || 0;
}

function flightComp (a, b){
    return a.DEPART - b.DEPART;
}

function JaJascript(flights) {
  this.flights = flights.sort(flightComp);
}

JaJascript.prototype.optimize = function() {
  var self = this;
  var allPath = self.findAvaliablePaths([new State([], self.flights)]);
//  var max = _.max(allPath, function(s) {
//    return s.gain;
//  });
  var max = {'gain':0};
  for(var i = 0;i<allPath.length;i++){
    if(allPath[i].gain > max.gain){
       max = allPath[i]; 
    }
  }
  var finalpath = [];
  for(var j=0;j<max.path.length;j++){
    finalpath.push(max.path[j].VOL);
  }
  return {
    'gain': max.gain,
    'path': finalpath
  };
};

function makeChildren(state) {
  var results = [];
  for (var i = 0; i < state.unaffected.length; i++) {
    var flight = state.unaffected[i];
    var next = flight.DEPART + flight.DUREE;
    //pas besoin de vérifier les vols antérieurs ou simultanés...
    var filtered = [];

    for(var j=i+1; j<state.unaffected.length; j++) {
      if(state.unaffected[j].DEPART >= next){
        filtered = state.unaffected.slice(j);
        break;
      }
    }
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
