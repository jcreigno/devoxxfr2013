var _ = require('underscore');

function State(path, index, end, gain) {
  this.path = path || [];
  this.index = index || 0;
  this.endIndex = end;
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
  var allPath = self.findAvaliablePaths([new State([],0,this.flights.length)]);
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
  var NUM_FLIGHTS = this.flights.length;
  for (var i = state.index; i < state.endIndex; i++) {
    var flight = this.flights[i];
    var next = flight.DEPART + flight.DUREE;
    //pas besoin de vérifier les vols antérieurs ou simultanés...
    var nextIndex = NUM_FLIGHTS, endIndex;
    for(var j=i+1; j<NUM_FLIGHTS; j++) {
      if(this.flights[j].DEPART >= next){
        nextIndex = j;
        break;
      }
    }
    if(nextIndex < NUM_FLIGHTS){
      var next = this.flights[nextIndex];
      var last = this.flights[NUM_FLIGHTS-1];
      var minIntercalaire = next.DEPART + next.DUREE;
      for(var j=nextIndex; j<NUM_FLIGHTS 
          && minIntercalaire < last.DEPART; j++) {
        var d = this.flights[j].DEPART + this.flights[j].DUREE;
        minIntercalaire = Math.min(d, minIntercalaire);
        if(this.flights[j].DEPART > minIntercalaire){
          endIndex = j;
          //console.log('%d, inter : %d',d, minIntercalaire);
          break;
        }
      }
    }
    results.push(new State(state.path.concat(flight.VOL), nextIndex, endIndex||NUM_FLIGHTS, state.gain + flight.PRIX));
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
