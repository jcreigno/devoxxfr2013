var http = require('http'),
  url = require('url'),
  director = require('director'),
  Scalaskel = require('./lib/Scalaskel');

var questions = {
  'Quelle est ton adresse email': 'jerome.creignou@gmail.com',
  'Es tu abonne a la mailing list(OUI/NON)': 'OUI',
  'Es tu heureux de participer(OUI/NON)': 'OUI',
  'Es tu pret a recevoir une enonce au format markdown par http post(OUI/NON)': 'OUI',
  'Est ce que tu reponds toujours oui(OUI/NON)': 'NON',
  'As tu bien recu le premier enonce(OUI/NON)': 'OUI',
};

var answer = function(q, res) {
  if (questions[q]) {
    res.end(questions[q], 'utf-8');
  } else {
    console.log(q);
    res.end('Je n\'ai pas la réponse à cette question.', 'utf-8');
  }
}

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
  var op = /^([0-9]*) ([0-9]*)$/.exec(u.query.q);
  if(op){
    this.res.end(''+(parseInt(op[1], 10) + parseInt(op[2], 10)), 'utf-8');
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
  //console.log('Voici les changes posssibles pour %d cents : "%s"', value, r);
  this.res.end(r, 'utf-8');
});


router.post('/enonce/:id', function() {
  this.res.writeHead(201);
  console.log(this.req.body);
  this.res.end();
});

http.createServer(function(req, res) {
  req.chunks = [];
  req.on('data', function(chunk) {
    req.chunks.push(chunk.toString());
  });

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
