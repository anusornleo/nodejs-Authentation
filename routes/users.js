var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const myPlaintextPassword = "s0//P4$$w0rD";
// const someOtherPlaintextPassword = "not_bacon";

var User = require("../models/user");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send({ data: "loginfail", message: req.flash("error") });
});

router.get("/register", function(req, res, next) {
  // res.render("register");
  res.send({ data: "regis", message: req.flash("error") });
});

router.post("/register", function(req, res, next) {
  const body = req.body;
  const user = new User(body);
  User.createUser(user, (err, user) => {
    if (err) throw err;
    // res.render("login", { title: "Login" });
    res.redirect("/login");
    // res.send({ data: "regis complete", message: req.flash("error") });
  });
});

router.get("/login", function(req, res, next) {
  res.send({ data: "login", message: req.flash("error") });
});

// router.post(
//   "/login",
//   passport.authenticate("local",{
//     failureRedirect: '/users',
//     failureFlash: false
//   }),

//   function(req, res) {
//     // res.send({message:'ok'})
//     req.flash("success", "You are logged in");
//     res.redirect("/users");
//   }
// );

router.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send({ data: "login", message: req.flash("error")[0] });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.send({ data: "home" });
    });
  })(req, res, next);
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy({ passReqToCallback: true }, function(
    req,
    username,
    password,
    done
  ) {
    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        return done(null, false, req.flash("error", "Username not found"));
      }

      User.comparePassword(password, user.password, (err, result) => {
        if (err) return done(err);
        if (result) {
          return done(null, user);
        } else {
          return done(null, false, req.flash("error", "Password Invalid"));
        }
      });
    });
  })
);

router.get("/logout", (req, res, next) => {
  req.logout();
  req.flash("success", "You are logged out");
  res.redirect("/");
});

// router.get("*", function(req, res, next) {
//   res.locals.login = req.isAuthenticated();
//   console.log(res.locals.login);
//   next();
// });

module.exports = router;
