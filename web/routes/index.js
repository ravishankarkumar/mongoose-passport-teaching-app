var express = require('express');
var router = express.Router();

var passport = require('passport');

var Product = require('./models/product.js');
const Vote = require('./models/votes');
const config = require('./config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Product Pitch Vote', message: 'Ravi must have sent you a link on whatsapp for voting, click on that link to vote' });
});

// router.get('/me', function(req, res, next) {
//   res.render('me', { title: 'about me', name: 'Ravi Shankar' });
// });

// router.get('/year/:id', function(req, res, next) {
//   var year = req.params.id;
//   if(year ==1){
//   res.send("Too much energy");
//   } else if(year ==2){
//     res.send("Learning to be lazy");
//   } else if (year == 3){
//     res.send("Intern---intern---placement--placement");
//   } else if(year==4){
//     res.send("laziest people on the campus");
//   } else {
//     res.send("tumhara kuchh nahi ho sakta :P");
//   }
// });

// router.get('/addnewproduct', function(req, res, next) {
//   var p = new Product();
//   p.name = "My stylish shirt";
//   p.price = 699;
//   p.save();
//   res.redirect('/');
// });

// router.get('/allProduct', function(req, res, next) {
//   Product.find(function(err,doc){
//     if(err){
//       //TODO
//     };
//     res.send(doc);
//   });
// });

// router.get('/product/:id', function(req, res, next) {
//   Product.findOne(function(err,doc){
//     if(err){
//       //TODO
//     };
//     res.send(doc.name);
//   });
// });

// router.get('/addcustomproduct', function(req, res, next) {
//   res.render('addcustomproduct', { title: 'add new product' });
// });

// router.post('/addcustomproduct', function(req, res, next) {
//   var p = new Product();
//   if(req.body.productname){
//     p.name=req.body.productname;
//   };
//   if(req.body.price){
//     p.price=req.body.price;
//   };
//   p.save(function(err){
//     if(!err){
//       console.log("Data has been saved");
//     } else {
//       console.log("Error occurred");
//       res.redirect('/');
//     }
//   });
//     res.redirect('/');
// });

// router.get('/update/:productId', function(req, res, next) {
//     var productId = req.param("productId");
//     Product.findOne({_id: req.param("productId")}, function(err, doc){
//       doc.name = "Modified product";
//       doc.save();
//     });
//     res.redirect('/');
// });

// router.get('/delete/:productId', function(req, res, next) {
//     var productId = req.param("productId");
//     Product.remove({_id: req.param("productId")}, function(err){
//       console.log("removed");
//     });
//     res.redirect("/");
// });

// router.get('/login', function(req, res, next) {
//   res.render('login', { title: 'Login to firstApp'});
// });

// router.get('/signup', function(req, res, next) {
//   res.render('signup', { title: 'Sign Up for firstApp'});
// });

//  router.post('/signup', passport.authenticate('local-signup', {
//    successRedirect : '/profile', // redirect to the secure profile section
//    failureRedirect : '/signup', // redirect back to the signup page if there is an error
//    failureFlash : true // allow flash messages
//  }));
 
//  router.post('/login', passport.authenticate('local-login', {
//    successRedirect : '/profile', // redirect to the secure profile section
//    failureRedirect : '/login', // redirect back to the signup page if there is an error
//    failureFlash : true // allow flash messages
//  }));
 
//   router.get('/logout', function(req, res, next) {
//    req.logout();
//    res.redirect('/');
//  });
 
//  router.get('/profile', function(req, res, next) {
//   if(req.user){
//     res.render('profile', { title: 'Profile Page', userEmail: req.user.local.email });
//   } else {
//     res.render('profile', {title: "You are not logged in", userEmail: "Not Logged In"});
//   }
// });


router.get('/vote', function(req, res, next) {
  res.redirect('/vote/notallowed');
});

router.get('/vote/:userkey', function(req, res, next) {
  const userkey = req.params.userkey;
  if (!userkey) {
    res.render('errorpage', {title: 'Error Page', message: 'Please open the valid link'});
  } else if (!config || !config.users || !config.users[userkey]) {
    res.render('errorpage', {title: 'Error Page', message: 'You are not authorised to access this link'});
  } else {
    const productConfig = config.product;
    let productsArray = [];
    for(let key in productConfig){
      if (productConfig.hasOwnProperty(key)) {
        let obj = {
          productkey: key,
          name: productConfig[key].name
        }
        productsArray.push(obj);
      }
    }
    res.render('vote', {
      title: 'Vote for your favourite product',
      message: 'To edit your choices, come back to this link again.',
      products: productsArray,
      userkey: userkey
    });
  }
});

router.get('/vote/:userkey/:productkey', function(req, res, next) {
  const userkey = req.params.userkey;
  const productkey = req.params.productkey;
  if (!userkey || !productkey) {
    res.render('errorpage', {title: 'Error Page', message: 'Please open the valid link'});
  } else if (!config || !config.users || !config.users[userkey] || !config.product || !config.product[productkey]) {
    res.render('errorpage', {title: 'Error Page', message: 'You are not authorised to access this link'});
  } else if (config.users[userkey].notallowed === productkey) {
    res.render('errorpage', {title: 'Error Page', message: 'Seriously?? Are you kidding me? you cannot vote for yourself.'});
  } else {
    const query = {user_id: userkey};
    const updateData = {
      user_id: userkey, 
      voted: productkey,
      created_at: new Date(),
      user_name: config.users[userkey].name
    };
    Vote.findOneAndUpdate(query, updateData, {upsert:true}, function(err, doc){
      if (err){
        res.render('errorpage', {title: 'Error Page', message: 'You vote was not saved due to some reason. Contact Ravi'});
      }
      res.render('index', {title: 'Voted', message: 'You vote was recorded!'});
  });
  }
});

router.get('/allvotes', function(req, res, next) {
  Vote.find(function(err,doc){
    if(err){
      res.render('errorpage', {title: 'Error Page', message: 'Some error occurred'});
    };
    res.render('allvotes', {title: 'Showing all votes', votes: doc});
  });
});

module.exports = router;
