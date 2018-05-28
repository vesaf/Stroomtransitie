var express = require('express');
var router = express.Router();

var questions = require('../questions.json');
var score = 0;
/* GET quiz. */
router.get('/', function(req, res, next) {
  res.render('quiz', { question: 'Express' });
  console.log("set 0")
});

/* GET quiz question. */
router.get('/single', function(req, res, next) {
  var Qno = req.url.substring(12);
  var keys = Object.keys(questions);
  var found = false;
  for(var i = 0; i < keys.length; i++) {
    // console.log(keys[i] == Qno);
    if (keys[i] == Qno) {
      // console.log(JSON.stringify(questions[keys[i]]));
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify(questions[keys[i]]));
      var found = true;
    }
  }
  if (!found) {
    res.status(200).send();
  }
});

router.post('/send', function (req, res, next) {
  score += parseInt(JSON.parse(Object.keys(req.body)[0])["Score"]);
  console.log("score: " + score);
  res.status(200).send();
});

router.get("/score", function (req, res, next) {
  res.status(200).send({score: score});
});

router.get("/result", function (req, res, next) {
  res.render('result', { score: score });
  score = 0;
});

module.exports = router;
