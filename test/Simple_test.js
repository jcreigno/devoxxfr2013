var vows = require('vows'),
  request = require('request'),
  assert = require('assert');

var server = require('../index');

var apiUrl = 'http://' + (process.env.IP || 'localhost') + ':' + (process.env.PORT || 5000);

var apiTest = {
  general: function(method, url, data, cb) {
    //console.log( 'cb?', cb )
    request({
      method: method,
      url: apiUrl + (url || ''),
      body: data || ''
    },

    function(req, res) {
      cb(res);
    });
  },
  get: function(url, data, cb) {
    apiTest.general('GET', url, data, cb);
  },
  post: function(url, data, cb) {
    apiTest.general('POST', url, data, cb);
  },
  put: function(url, data, cb) {
    apiTest.general('PUT', url, data, cb);
  },
  del: function(url, data, cb) {
    apiTest.general('DELETE', url, data, cb);
  }
};

function assertStatus(code) {
  return function(res, b, c) {
    assert.equal(res.statusCode, code);
  };
}

function assertResultBody(body) {
  return function(res, b, c) {
    assert.equal(res.body, body);
  };
}

function assertEmptyBody() {
  return function(res, b, c) {
    if (res.body) {
      assert.fail(res.body, undefined);
    }
  };
};

var questions = {
  'Quelle est ton adresse email': 'jerome.creignou@gmail.com',
  'Es tu abonne a la mailing list(OUI/NON)': 'OUI',
  'Es tu heureux de participer(OUI/NON)': 'OUI',
  'Es tu pret a recevoir une enonce au format markdown par http post(OUI/NON)': 'OUI',
  'Est ce que tu reponds toujours oui(OUI/NON)': 'NON',
  'As tu bien recu le premier enonce(OUI/NON)': 'OUI',
  '1 1': '2',
  '2 2': '4',
  '1-1': '0',
  '2-2': '0',
  '1*1': '1',
  '3*3': '9',
  '1/1': '1',
  '3/3': '1',
  '(1+2)*2': '6',
  '(1+2)/2': '1,5',
  '(1+2+3+4+5+6+7+8+9+10)*2': 110,
  '((1,1+2)+3,14+4+(5+6+7)+(8+9+10)*4267387833344334647677634)/2*553344300034334349999000':
    '31878018903828899277492024491376690701584023926880',
  '(((1,1+2)+3,14+4+(5+6+7)+(8+9+10)*4267387833344334647677634)/2*553344300034334349999000)/31878018903828899277492024491376690701584023926880':1,
  'As tu passe une bonne nuit malgre les bugs de l etape precedente(PAS_TOP/BOF/QUELS_BUGS)': 'PAS_TOP'
};


function createQuestionBatch() {
  var batch = {};
  Object.keys(questions).forEach(function(q) {
    batch['à la question "' + q + '"'] = {
      topic: function() {
        apiTest.get('?q=' + q, '', this.callback);
      }
    };
    batch['à la question "' + q + '"']['il répond "' + questions[q] + '"'] = assertResultBody(questions[q]);
  });
  return batch;
}

vows.describe('Le serveur "Code Story"').addBatch({
  'doit être démarré': {
    topic: function() {
      apiTest.get('', '', this.callback);
    },
    'et répondre un code 200': assertStatus(200),
    'et demande une question': assertResultBody('Pose une question !')
  }
}).addBatch(createQuestionBatch()).addBatch({
  'reçoit le premier enoncé en post': {
    topic: function() {
      apiTest.post('/enonce/test', "super secret markdown.", this.callback);
    },
    'et répondre un code 201': assertStatus(201),
    'et ne répond rien': assertEmptyBody(),
    teardown: function() {
      server.close(function() {
        console.log('server closed');
      });
    }

  }

}).export(module);
