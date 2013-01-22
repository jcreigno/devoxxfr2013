var _ = require('underscore');

function Schedule(flight, nextSchedule) {
  this.flight = flight;
  this.gain = Number(flight.PRIX);
  this.next = nextSchedule;
  if(this.next){
    this.gain += Number(this.next.gain);
  }
}

Schedule.prototype.mayFollow = function(f) {
  var result = (f.DUREE + f.DEPART) <= this.flight.DEPART;
  console.log('%s may follow %s (%d / %d + %d) : %s', this.flight.VOL, f.VOL, this.flight.DEPART,f.DEPART, f.DUREE,result);
  return result;
};

Schedule.prototype.toString = function() {
  var res = this.flight.VOL+'('+this.gain+')';
  if(this.next){
    res +=  '->' + this.next;
  }
  return  res;
};


Schedule.prototype.subPath = function(f) {
  if(!this.next){
    return null;
  }
  if(this.next.mayFollow(f)){
    return this.next;
  }
  return this.next.subPath(f);
};

function flightComp(a, b) {
  return a.DEPART - b.DEPART;
}

function JaJascript(flights) {
  this.flights = flights.sort(flightComp);
  console.log(this.flights);
}

module.exports = function(flights) {
  return new JaJascript(flights);
};

JaJascript.prototype.optimize = function() {
  var self = this;
  var allPaths = self.findAvaliablePaths([new Schedule(this.flights.pop())]);
  var max = {
    'gain': 0
  };
  for (var i = 0; i < allPaths.length; i++) {
    if (allPaths[i].gain > max.gain) {
      max = allPaths[i];
    }
  }
  var finalPath = [];
  var f = max;
  while(f){
    finalPath.push(f.flight.VOL);
    f = f.next;
  }
  return {
    'gain': max.gain,
    'path': finalPath
  };
};

function maximizeGain(e){
  return e.gain;
}

function dumpArray(ar, prefix){
  var s = prefix || '';
  ar.forEach(function(e){s+= (' '+e.flight.VOL);});
  console.log(s);
}

function dumpPath(paths){
  paths.forEach(function(e){
    console.log('------------------');
    console.log('| '+e.flight.VOL + ' |');
  });
  console.log('__________________');
}

JaJascript.prototype.findAvaliablePaths = function(init) {
  var paths = init;
  for (var i = this.flights.length - 1; i >= 0; i--) {
    var f = this.flights[i];
    console.log('----> flight is %s',f.VOL);
    dumpPath( paths);
    var todo = [];
    var index = -1;
    while (paths.length > 0) {
      var path  = paths.pop();
      if (path.mayFollow(f)) {
        index = todo.push(new Schedule(f, path));
      } else {
        var sub = path.subPath(f);
        if(sub){
          console.log('sub path : %s',sub);
          index = todo.push(new Schedule(f,sub));
        }else{
          todo.push(path);
        }
      }
    }
    if(index<0){
        todo.push(new Schedule(f));
    }
    paths = todo;
  }
  return paths;
};
