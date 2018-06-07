var express = require('express');
var router = express.Router();
var Gpio = require('pigpio').Gpio;

var btnState;
var timeOutId;

var gpioButton = new Gpio(25, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_UP,
  edge: Gpio.EITHER_EDGE
});

gpioButton.on('interrupt', function (level) {
  var btnState = level;
  clearTimeout(timeOutId);
  timeOutId = setTimeout(btnPressed, 10, btnState);
});

function btnPressed(btnState) {
  // read button state, 
  var level = gpioButton.digitalRead(27)
  if (btnState === level) {
      console.log('buttonState: ' + level);
      io.emit('state', level); 
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
