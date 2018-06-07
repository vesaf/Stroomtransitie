var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var quizRouter = require('./routes/quiz');
var testRouter = require('./routes/test');

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
  var level = gpioButton.digitalRead(25)
  if (btnState === level) {
      console.log('buttonState: ' + level);
      io.emit('state', level); 
  }
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/quiz', quizRouter);
app.use('/test', testRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
