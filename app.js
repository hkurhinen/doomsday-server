var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname+'/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});

var http = require('http').Server(app);
http.listen(3000, function(){
  console.log('Express server listening on port 3000');
});