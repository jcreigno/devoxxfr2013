var http = require('http'),
  url = require('url'),
  director = require('director');

var questions = {
  'Quelle est ton adresse email': 'jerome.creignou@gmail.com',
  'Es tu abonne a la mailing list(OUI/NON)': 'OUI',
  'Es tu heureux de participer(OUI/NON)': 'OUI',
  'Es tu pret a recevoir une enonce au format markdown par http post(OUI/NON)': 'OUI',
  'Est ce que tu reponds toujours oui(OUI/NON)': 'NON',
  'As tu bien recu le premier enonce(OUI/NON)': 'OUI'
};

var answer = function(q, res) {
  if (questions[q]) {
    res.end(questions[q], 'utf-8');
  }
  else {
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
  answer(u.query.q, this.res);
});

router.get('/scalaskel/change/:value', function(value) {
  this.res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  var result = {msg:'aucune idée pour le moment repasse plus tard !'};
  if(value==1){
    result = [{foo:1}];
  }else if(value == 7){
    result = [{foo:7},{bar:1}];
  }
  var r = JSON.stringify(result);
  console.log('essaye faire le change pour '+value+' : '+r);
  this.res.end(r, 'utf-8');
});


router.post('/enonce/:id', function() {
  console.log(this.req.body);
  this.res.end();
});

http.createServer(function(req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function (err) {
    if (err) {
      res.writeHead(404);
      res.end();
    }
    console.log('Served ' + req.url);
  });

}).listen(process.env.PORT || 5000, function() {
  console.log("Listening ...");
});
