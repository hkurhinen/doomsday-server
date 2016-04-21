var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var path = require('path');
var connect = require('camo').connect;
var Entry = require('./model/entry');
var exec = require('child_process').exec;

var app = express();
var gameStarted = 0;
var currentTeam = '';
var uri = 'nedb://./data/doomsdaymachine';

function blue(){
  exec('sh '+config.scriptPath+'blue_on.sh'); 
}
function green(){
  exec('sh '+config.scriptPath+'green_on.sh');
}
function red(){
  exec('sh '+config.scriptPath+'red_on.sh');  
}
function allOff(){
  exec('sh '+config.scriptPath+'blue_off.sh');
  exec('sh '+config.scriptPath+'green_off.sh');
  exec('sh '+config.scriptPath+'red_off.sh');
}
function allOn(){
  exec('sh '+config.scriptPath+'blue_on.sh');
  exec('sh '+config.scriptPath+'green_on.sh');
  exec('sh '+config.scriptPath+'red_on.sh');
}

connect(uri).then(function (db) {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(express.static(__dirname + '/public'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get('/', function (req, res) {
    res.render('index');
  });

  app.get('/reset', function(req, res){
    allOff();
    res.send('ok');
  });

  app.post('/start', function (req, res) {
    gameStarted = Date.now();
    currentTeam = req.body.team;
    res.send({ team: currentTeam, game: 'started' });
  });

  app.post('/hint', function (req, res) {
    var option = req.body.option;
    allOff();
    if (option == 1) {
      green();
    } else if (option == 2) {
      red();
    } else if (option == 3) {
      blue();
    }
    res.send('ok');
  });


  app.post('/end', function (req, res) {
    allOff();
    var code = req.body.code;
    if (code == config.rightCode) {
      var endTime = Date.now();
      var solvingTime = endTime - gameStarted;
      var entry = Entry.create({
        name: currentTeam,
        time: solvingTime
      });
      entry.save().then(function(){
        allOn();
        res.send({ answer: 'ok', time: solvingTime });
      });
    } else {
      res.send({ answer: 'fail' });
    }
  });
  
  app.get('/leaderboard', function(req, res){
    Entry.find({}, {sort: 'time'}).then(function(entries){
      res.render('leader', {entries: entries});
    });
  });

  var http = require('http').Server(app);
  http.listen(3000, function () {
    console.log('Express server listening on port 3000');
  });
});