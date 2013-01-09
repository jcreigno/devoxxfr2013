var http = require('http'),
    url = require('url');

var questions = {
    'Quelle est ton adresse email': 'jerome.creignou@gmail.com',
    'Es tu abonne a la mailing list(OUI/NON)': 'OUI',
    'Es tu heureux de participer(OUI/NON)': 'OUI',
    'Es tu pret a recevoir une enonce au format markdown par http post(OUI/NON)': 'OUI',
    'Est ce que tu reponds toujours oui(OUI/NON)': 'NON',
    'As tu bien recu le premier enonce(OUI/NON)': 'NON'
};

var answer = function(q, res) {
    if (questions[q]) {
        res.end(questions[q], 'utf-8');
    } else {
        console.log(q);
        res.end('Je n\'ai pas la réponse à cette question.', 'utf-8');
    }
}

var routes = {
    GET: {
        '/': function(req, res, u) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            if (!u.query.q) {
                res.end('Pose une question !', 'utf-8');
                return;
            }
            answer(u.query.q, res);
        }
    },
    POST: {
        '/enonce/1': function(req, res, u) {
            var body = '';
            req.on('data', function(data) {
                body += data;
            });
            req.on('end', function() {
                console.log(body);
                //answer(b.q, res);
            });
        }
    }
};

http.createServer(function(req, res) {
    var u = url.parse(req.url, true);
    if (routes[req.method]) {
        routes[req.method][u.pathname](req, res, u);
    }
    else {
        res.end();
    }
}).listen(process.env.PORT || 5000, function() {
    console.log("Listening ...");
});
