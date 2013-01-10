var _ = require('underscore');

function Scalaskel() {
  
}

module.exports = function() {
  return new Scalaskel();
};
var cents = [
  {name:'foo', value:1}
, {name:'bar', value:7}
, {name:'qix', value :11}
, {name:'baz', value :21}
];
_.each(cents,function(item){
  module.exports[item.name] = item.value;
});

Scalaskel.prototype.change = function(groDessimal){
  return this.decompose(groDessimal, cents.slice());
};

Scalaskel.prototype.decompose = function(groDessimal, factors){
  var result = [];
  if(groDessimal === 0){
    return result;
  }
  if(groDessimal === 1){
    return [{'foo':1}];
  }
  
  var f;
  while(f = factors.pop()){
    if(groDessimal < f.value) {
      continue ;
    }
    var quotien = Math.floor(groDessimal/f.value);
    var reste = groDessimal%f.value;
    console.log('%d = %d x %d + %d',groDessimal,f.value,quotien,reste);
    //addResults(f, quotien);
    var r = {};
    r[f.name]=quotien;
    result.push(r);
    console.log('pushing {%s:%d}',f.name, quotien);
    if(reste>0){
      result = merge(r, this.decompose(reste,factors.slice()));
    }
  }
  return result;
};

function merge(result, others){
  var name = _.keys(result)[0];
  var value = _.values(result)[0];
  others.forEach(function(o){
    if(o[name]){
      o[name] += value;
    }else{
      o[name] = value;
    }
  });
  return others;
}



function addResults(f,quotien){
  var c = [];
  var name = f.name;
  for(var i=quotien;i>1;i--){
    var r = {};
    r[name]=i;
    c.push(r);
  }
}

