var _ = require('underscore');

function State(path, index, gain) {
  this.path = path || [];
  this.index = index || 0;
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
  var allPath = self.findAvaliablePaths([new State()]);
  var max = {'gain':0};
  for(var i = 0;i<allPath.length;i++){
    if(allPath[i].gain > max.gain){
       max = allPath[i]; 
    }
  }
  return {
    'gain': max.gain,
    'path': max.path
  };
};

JaJascript.prototype.makeChildren = function(state) {
  var results = [];
  for (var i = state.index; i < this.flights.length; i++) {
    var flight = this.flights[i];
    var next = flight.DEPART + flight.DUREE;
    //pas besoin de vérifier les vols antérieurs ou simultanés...
    var nextIndex = this.flights.length;
    for(var j=i+1; j<this.flights.length; j++) {
      if(this.flights[j].DEPART >= next){
        nextIndex = j;
        break;
      }
    }
    results.push(new State(state.path.concat(flight.VOL), nextIndex, state.gain + flight.PRIX));
  }
  return results;
}

JaJascript.prototype.findAvaliablePaths = function(stack) {
  var results = [];
  while (stack.length > 0) {
    var state = stack.pop();
    //console.log(state);
    if (state.index === this.flights.length) {
      results.push(state);
    } else {
      stack = stack.concat(this.makeChildren(state));
    }
  }
  return results;
};

module.exports = function(flights) {
  return new JaJascript(flights);
};
