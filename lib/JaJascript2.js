var _ = require('underscore');

function Schedule(flight) {
  this.flight = flight;
  this.gain = Number(flight.PRIX);
  this.next = null;
}

Schedule.prototype.setNextSchedule = function (next){
  this.next = next;
  if(next){
    this.gain += next.gain;
  }
};

Schedule.prototype.retour = function (){
  return this.flight.DEPART + this.flight.DUREE;
};

Schedule.prototype.duree = function (){
  return this.flight.DUREE;
};

Schedule.prototype.depart = function (){
  return this.flight.DEPART;
};


function flightComp(a, b) {
  return a.DEPART - b.DEPART;
}

function JaJascript(flights) {
  this.flights = _.map(flights.sort(flightComp), function toSchedule(f){
    return new Schedule(f);
  });
  this.maxSchedule = {gain:0};
}

module.exports = function(flights) {
  return new JaJascript(flights);
};

JaJascript.prototype.findMaxInInterleave = function (index) {
  var self = this, j;
  var NUM_FLIGHTS = self.flights.length;
  var next = self.flights[index];
  var last = self.flights[NUM_FLIGHTS - 1];
  //console.log('current flight is %s, min interval is %d',next.flight.VOL,minIntercalaire);

  var maxInInterleave = null;
  for (j = index + 1; j < NUM_FLIGHTS; j++) {
    //console.log('checking %s.',self.flights[j].flight.VOL);
    if(self.flights[j].depart() >= next.retour()){
      //console.log('%s is avaliable .',self.flights[j].flight.VOL);
      //var d = self.flights[j].retour();
      //minIntercalaire = Math.min(d, minIntercalaire);
      //console.log('interval is %d',minIntercalaire);
      if(!maxInInterleave || self.flights[j].gain > maxInInterleave.gain){
        maxInInterleave = self.flights[j];
      } else if(self.flights[j].gain === maxInInterleave.gain 
          && self.flights[j].retour() < maxInInterleave.retour()){
        maxInInterleave = self.flights[j];
      }
      
    }
  }
  return maxInInterleave;
};

JaJascript.prototype.optimize = function() {
  var self = this, i;
  self.findAvaliablePaths();
  var max = self.maxSchedule;
  var path = [];
  s = max;
  while (s){
    path.push(s.flight.VOL);
    s = s.next;
  }
  return {
    'gain': max.gain,
    'path': path
  };
};

JaJascript.prototype.findAvaliablePaths = function() {
  for (i = this.flights.length - 1; i >= 0; i--) {
    this.flights[i].setNextSchedule(this.findMaxInInterleave(i));
    if(this.flights[i].gain > this.maxSchedule.gain){
      this.maxSchedule = this.flights[i]; 
    }
  }
};
