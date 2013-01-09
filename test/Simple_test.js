var vows = require('vows'),
    request = require('request'),
    assert = require('assert');

require('../index');

var apiUrl = 'http://' + (process.env.IP || 'localhost') + ':' + (process.env.PORT || 5000);

var apiTest = {
    general: function(method, url, data, cb) {
        //console.log( 'cb?', cb )
        request({
            method: method,
            url: apiUrl + (url || ''),
            json: data || {}
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

var questions = {
    'Quelle est ton adresse email': 'jerome.creignou@gmail.com',
    'Es tu abonne a la mailing list(OUI/NON)': 'OUI',
    'Es tu heureux de participer(OUI/NON)': 'OUI',
    'Es tu pret a recevoir une enonce au format markdown par http post(OUI/NON)': 'OUI',
    'Est ce que tu reponds toujours oui(OUI/NON)': 'NON'
};


function createQuestionBatch() {
    var batch = {};
    Object.keys(questions).forEach(function(q) {
        batch['à la question "' + q + '"'] = {
            topic: function() {
                apiTest.get('?q=' + q, {}, this.callback);
            }
        };
        batch['à la question "' + q + '"']['il répond "' + questions[q] + '"'] = assertResultBody(questions[q]);
    });
    return batch;
}

vows.describe('Le serveur "Code Story"').addBatch({
    'doit être démarré': {
        topic: function() {
            apiTest.get('', {}, this.callback);
        },
        'et répondre un code 200': assertStatus(200),
        'et demande une question': assertResultBody('Pose une question !')
    }
}).addBatch(createQuestionBatch()).addBatch({
    'reçoit le premier enoncé':{
        topic:function() {
            apiTest.post('/enonce/1', {}, this.callback);
        },
        'et répond "bien reçu"': assertResultBody('bien reçu')
        
    }

}).export(module);
