var http = require('http'),
  url = require('url'),
  util = require('util'),
  path = require('path'),
  director = require('director'),
  filed = require('filed'),
  Parser = require('./lib/Parser').Parser,
  Scalaskel = require('./lib/Scalaskel'),
  JaJascript = require('./lib/JaJascript2');

var questions = {
  'Quelle est ton adresse email': 'jerome.creignou@gmail.com',
  'Es tu abonne a la mailing list(OUI/NON)': 'OUI',
  'Es tu heureux de participer(OUI/NON)': 'OUI',
  'Es tu pret a recevoir une enonce au format markdown par http post(OUI/NON)': 'OUI',
  'Est ce que tu reponds toujours oui(OUI/NON)': 'NON',
  'As tu bien recu le premier enonce(OUI/NON)': 'OUI',
  'As tu passe une bonne nuit malgre les bugs de l etape precedente(PAS_TOP/BOF/QUELS_BUGS)': 'PAS_TOP',
  'As tu bien recu le second enonce(OUI/NON)': 'OUI',
  'As tu copie le code de ndeloof(OUI/NON/JE_SUIS_NICOLAS)':'NON',
  'Souhaites-tu-participer-a-la-suite-de-Code-Story(OUI/NON)': 'NON'
};

var answer = function(q, res) {
  if (questions[q]) {
    res.end(questions[q], 'utf-8');
  } else {
    console.log(q);
    res.end('Je n\'ai pas la réponse à cette question.', 'utf-8');
  }
};

var compte = function(match) {
  var res = Parser.evaluate(match, {});
  res = res.stripTrailingZeros();
  return res.toPlainString();
};

var router = new director.http.Router();

router.get('/', function() {
  var u = url.parse(this.req.url, true);
  this.res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  if (!u.query.q) {
    this.res.end('Pose une question !', 'utf-8');
    return;
  }
  var match = /[0-9]/.exec(u.query.q);
  if (match) {
    var input = u.query.q.split(' ').join('+');
    input = input.split(',').join('.');
    var cpte = compte(input);
    this.res.end(cpte.split('.').join(','), 'utf-8');
    return;
  }
  answer(u.query.q, this.res);
});

var scalaskel = new Scalaskel();
router.get('/scalaskel/change/:value', function(value) {
  this.res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  var result = scalaskel.change(value);
  var r = JSON.stringify(result);
  this.res.end(r, 'utf-8');
});


router.post('/enonce/:id', function(id) {
  this.req.pipe(filed(path.join(__dirname,'enonce-' + id +'.md')));
  this.res.writeHead(201);
  console.log(this.req.body);
  this.res.end();
});
router.get('/enonce/:id', function(id) {
  filed(path.join(__dirname,'enonce-' + id +'.md')).pipe(this.res);
});

router.post('/jajascript/optimize', function(){
  var input = JSON.parse(this.req.data);
  //console.log(this.req.data);
  var result = new JaJascript(input).optimize();
  result = JSON.stringify(result);
  this.res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length' : result.length
  });
  setTimeout(function() {
    console.log('resultat : ' + result);
  }, 0);
  this.res.end(result, 'utf-8');
});

var server = http.createServer(function(req, res) {
  req.data = '';
  req.on('data', function(chunk) {
    req.data += chunk.toString();
  });
//  for(var header in req.headers){
//    console.log('%s:%s',header,req.headers[header]);
//  }

  router.dispatch(req, res, function(err) {
    if (err) {
      res.writeHead(404);
      res.end();
    }
    console.log('Served ' + req.url);
  });

}).listen(process.env.PORT || 5000, function() {
  console.log("Listening ...");
});

module.exports = server;
