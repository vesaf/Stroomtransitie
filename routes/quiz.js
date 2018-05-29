var express = require('express');
var router = express.Router();
var fs = require('fs');
var csvWriter = require('csv-write-stream');


var questions = require('../questions.json');
var score = 0;
var answers = {};
/* GET quiz. */
router.get('/', function(req, res, next) {
  res.render('quiz', { question: 'Express' });
});

/* GET quiz question. */
router.get('/single', function(req, res, next) {
  var Qno = req.url.substring(12);
  var keys = Object.keys(questions);
  var found = false;
  for(var i = 0; i < keys.length; i++) {
    if (keys[i] == Qno) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(questions[keys[i]]));
      var found = true;
    }
  }
  if (!found) {
    res.send();
  }
});

router.post('/send', function (req, res, next) {
  var data = JSON.parse(Object.keys(req.body)[0]);
  score += parseInt(data["Score"]);
  answers[data["Question"]] = parseInt(data["Answer"]);

  res.send();
});

router.get("/score", function (req, res, next) {
  res.send({score: score});
});

router.get("/result", function (req, res, next) {
  res.render('result', { score: score });
  saveAnswers();
  score = 0;
});

router.post("/reset", function (req, res, next) {
  if (Object.keys(answers).length > 0) {
    saveAnswers();
    score = 0;
  }
  res.send();
});

function saveAnswers() {
  var writer = csvWriter();
  writer.pipe(fs.createWriteStream('userData.csv', {flags: 'a'}));
  writer.write(answers);
  writer.end();
}

module.exports = router;