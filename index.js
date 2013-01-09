var http = require('http'), url = require('url');

var questions = {
    'Quelle est ton adresse email' : 'jerome.creignou@gmail.com',
    'Es tu abonne a la mailing list(OUI/NON)' : 'OUI',
    'Es tu heureux de participer(OUI/NON)' : 'OUI',
    'Es tu pret a recevoir une enonce au format markdown par http post(OUI/NON)' : 'OUI',
    'Est ce que tu reponds toujours oui(OUI/NON)' : 'NON'
};

http.createServer(function(req,res){ 
  res.writeHead(200,{'Content-Type':'text/plain'});
  var u = url.parse(req.url,true);
  if(!u.query.q){
    res.end('Pose une question !','utf-8');
    return;
  }
  if(questions[u.query.q]){
    res.end(questions[u.query.q],'utf-8');
  } else{
    console.log(u.query);
    res.end('Je n\'ai pas la réponse à cette question.','utf-8');  
  }
}).listen(process.env.PORT||5000, function(){
  console.log("Listening ...");
});
