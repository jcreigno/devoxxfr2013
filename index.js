var http = require('http'), url = require('url');

http.createServer(function(req,res){ 
  res.writeHead(200,{'Content-Type':'text/plain'});
  var u = url.parse(req.url,true);
  console.log(u.query);
  if(!u.query.q){
    res.end('Pose une question !','utf-8');
    return;
  }
  if(u.query.q == 'Quelle est ton adresse email'){
    res.end('jerome.creignou@gmail.com','utf-8');
  } else if(u.query.q == 'Es tu abonne a la mailing list(OUI/NON)'){
    res.end('OUI','utf-8');
  }else if(u.query.q == 'Es tu heureux de participer(OUI/NON)'){
    res.end('OUI','utf-8');
  }else{
    res.end('Je n\'ai pas la réponse à cette question.','utf-8');  
  }
}).listen(process.env.PORT||5000, function(){
  console.log("Listening ...");
});