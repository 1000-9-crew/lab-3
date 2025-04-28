const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');

var authRouter = require('./routes/authRouter');
var teacherRouter = require('./routes/teacherRouter');
var studentRouter = require('./routes/studentRouter');
var homeRouter = require('./routes/homeRouter');
var fileRouter = require('./routes/fileRouter');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 1 week
  })
)

app.use("/demo", fileRouter);
app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));


app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
