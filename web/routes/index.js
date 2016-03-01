var express = require('express');
var router = express.Router();

var passport = require('passport');

var Product = require('./models/product.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/me', function(req, res, next) {
  res.render('me', { title: 'about me', name: 'Ravi Shankar' });
});

router.get('/year/:id', function(req, res, next) {
  var year = req.params.id;
  if(year ==1){
  res.send("Too much energy");
  } else if(year ==2){
    res.send("Learning to be lazy");
  } else if (year == 3){
    res.send("Intern---intern---placement--placement");
  } else if(year==4){
    res.send("laziest people on the campus");
  } else {
    res.send("tumhara kuchh nahi ho sakta :P");
  }
});

router.get('/addnewproduct', function(req, res, next) {
  var p = new Product();
  p.name = "My stylish shirt";
  p.price = 699;
  p.save();
  res.redirect('/');
});

router.get('/allProduct', function(req, res, next) {
  Product.find(function(err,doc){
    if(err){
      //TODO
    };
    res.send(doc);
  });
});

router.get('/product/:id', function(req, res, next) {
  Product.findOne(function(err,doc){
    if(err){
      //TODO
    };
    res.send(doc.name);
  });
});

router.get('/addcustomproduct', function(req, res, next) {
  res.render('addcustomproduct', { title: 'add new product' });
});

router.post('/addcustomproduct', function(req, res, next) {
  var p = new Product();
  if(req.body.productname){
    p.name=req.body.productname;
  };
  if(req.body.price){
    p.price=req.body.price;
  };
  p.save(function(err){
    if(!err){
      console.log("Data has been saved");
    } else {
      console.log("Error occurred");
      res.redirect('/');
    }
  });
    res.redirect('/');
});

router.get('/update/:productId', function(req, res, next) {
    var productId = req.param("productId");
    Product.findOne({_id: req.param("productId")}, function(err, doc){
      doc.name = "Modified product";
      doc.save();
    });
    res.redirect('/');
});

router.get('/delete/:productId', function(req, res, next) {
    var productId = req.param("productId");
    Product.remove({_id: req.param("productId")}, function(err){
      console.log("removed");
    });
    res.redirect("/");
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login to firstApp'});
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Sign Up for firstApp'});
});

 router.post('/signup', passport.authenticate('local-signup', {
   successRedirect : '/profile', // redirect to the secure profile section
   failureRedirect : '/signup', // redirect back to the signup page if there is an error
   failureFlash : true // allow flash messages
 }));
 
 router.post('/login', passport.authenticate('local-login', {
   successRedirect : '/profile', // redirect to the secure profile section
   failureRedirect : '/login', // redirect back to the signup page if there is an error
   failureFlash : true // allow flash messages
 }));
 
  router.get('/logout', function(req, res, next) {
   req.logout();
   res.redirect('/');
 });
 
 router.get('/profile', function(req, res, next) {
  if(req.user){
    res.render('profile', { title: 'Profile Page', userEmail: req.user.local.email });
  } else {
    res.render('profile', {title: "You are not logged in", userEmail: "Not Logged In"});
  }
});
module.exports = router;
