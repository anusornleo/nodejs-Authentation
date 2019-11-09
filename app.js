var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var passport = require('passport')
var expressValidator = require('express-validator')
var LocalStrategy = require('passport-local').Strategy
var multer = require('multer')
var upload = multer({dest:'./uploads'})
var flash = require('connect-flash')
var bcrypt = require('bcrypt')
var mongodb = require('mongodb')
var mongoose = require('mongoose')
var db = mongoose.connection
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
var cors = require('cors');

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})

app.use(cors())

// const corsConfig = function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:8000')
//   res.header('Access-Control-Allow-Credentials', true)
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
//   next()
// }

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'test',
  saveUninitialized:true,
  resave:true
}))

app.use(flash());
app.use((req,res,next)=>{
  res.locals.messages = require('express-messages')(req,res);
  next();
})

app.use(passport.initialize())
app.use(passport.session())

// app.use(expressValidator)

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

app.use(function(req, res, next) {
  res.locals.messages = req.flash();
  next();
});


// app.use(corsConfig);

module.exports = app;
