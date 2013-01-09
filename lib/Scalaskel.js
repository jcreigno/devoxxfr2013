var _ = require('underscore');

function Scalaskel() {
  

}

module.exports = function() {
  return new Scalaskel();
};
var cents = {foo:1, bar:7, qix:11, baz:21};
_.keys(cents).forEach(function(item){
  module.exports[item] = cents[item];
});

Scalaskel.prototype.change = function(groDessimal){
  
  
}

Scalaskel.prototype.decompose = function(groDessimal){
  
  
}

