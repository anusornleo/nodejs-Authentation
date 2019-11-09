var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ data: 'home' })
});

function ensureAuthenticated(req,res,next){
  console.log(req.isAuthenticated())
  if(req.isAuthenticated()){
    res.locals.user = req.isAuthenticated();
    return next();
  }
  res.redirect('/users/login')
}

module.exports = router;
