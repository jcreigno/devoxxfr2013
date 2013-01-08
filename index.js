require('http').createServer(function(req,res){ 
  res.writeHead(200,{'Content-Type':'text/plain'});
  res.end('jerome.creignou@gmail.com','utf-8');
}).listen(process.env.PORT||5000, function(){
  console.log("Listening on " + port);
});
