var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  // res.send(req.flash());
  // res.render('index', { title: 'Member'});
  res.json({ data: 'home' })
});

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    res.locals.user = req.isAuthenticated();
    return next();
  }
  res.redirect('/users/login')
}

module.exports = router;
