var express = require('express');
var cors = require('cors');
var path = require('path');

var monk = require('monk');
var db = monk('127.0.0.1:27017/assignment2');
var session = require('express-session');

var noteRouter = require('./routes/notes');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(session({
  secret: 'random_string_goes_here',
  resave: false,
  saveUninitialized: true
}));

app.use(function(req, res, next) {
  req.db = db;
  next();
})

app.options('*', cors());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use('/', noteRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(3001);