var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

var User = require("../models/user");

/* GET users listing. */
router.get("/", function(req, res, next) {
  // res.send(req.flash());
  res.send("respond with a resource");
});

router.get("/register", function(req, res, next) {
  res.render("register");
});

router.post("/register", function(req, res, next) {
  const body = req.body;
  const user = new User(body);
  User.createUser(user, (err, user) => {
    if (err) throw err;
    res.render("login", { title: "Login"});
    // res.redirect("/login");
  });
});

router.get("/login", function(req, res, next) {
  
  // res.render("login", { title: "Login" ,msg:req.flash()});
  res.json({ data: 'login' ,message:req.flash('error')})
});

router.post(
  "/login",
  passport.authenticate("local",{
    failureRedirect: '/users/login',
    failureFlash: true
  }),

  function(req, res) {
    req.flash("success", "You are logged in");
    res.redirect("/");
  }
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(function(username, password, done) {

    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: "Unkhow User" });
      }

      User.comparePassword(password, user.password, (err, result) => {
        if (err) return done(err);
        if (result) {
          return done(null, user);
        } else {

          return done(null, false, { message: "Invalid password" });
        }
      });
    });
  })
);

router.get("/logout", (req, res, next)=> {
  req.logout()
  req.flash('success','You are logged out')
  res.redirect("/");
});

router.get('*',function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  console.log(res.locals.login)
  next();
});



module.exports = router;
