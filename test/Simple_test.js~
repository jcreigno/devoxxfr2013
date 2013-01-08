var vows = require('vows')
  , request = require('request')
  , assert = require('assert');

require('../index');

var apiUrl = 'http://localhost:5000';

var apiTest = {
  general: function( method, url, data, cb ){
    //console.log( 'cb?', cb )
    request(
      {
        method: method,
        url: apiUrl+(url||''),
        json: data || {}
      },
      function(req, res){
        cb( res );
      }
    );
  },
  get: function( url, data, cb){ apiTest.general('GET', url, data, cb);  },
  post: function( url, data, cb){ apiTest.general('POST', url, data, cb);  },
  put: function( url, data, cb){ apiTest.general('PUT', url, data, cb);  },
  del: function( url, data, cb){ apiTest.general('DELETE', url, data, cb);  }
};

function assertStatus(code) {
  return function (res, b, c) {
    assert.equal(res.statusCode, code);
  };
}

function assertResultBody(body) {
  return function (res, b, c) {
    assert.equal(res.body, body);
  };
}



vows.describe('Le serveur "Code Story"').addBatch({
  'doit être démarré':{
    topic: function (){
      apiTest.get('', {} ,this.callback);
    },
    'et répondre un code 200': assertStatus(200)
  },
  'à la question "Quelle est ton adresse email"':{
    topic: function(){
      apiTest.get('?q=Quelle+est+ton+adresse+email', {} ,this.callback);
    },
    'il répond "jerome.creignou" chez "gmail"': assertResultBody('jerome.creignou@gmail.com')
  }
}).export(module);
