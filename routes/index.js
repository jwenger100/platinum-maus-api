var express = require('express');
var router = express.Router();

var deleteSubscriber = function(db, emailAddress, callback) {
  var collection = db.collection('Subscribers');

  collection.deleteOne({ emailAddress : emailAddress }, function(err, result) {
    callback(err, result);
  });
};

router.post('/contactUs', function(req, res) {
    req.mailer.send('email', {
        to: 'platinummaus@gmail.com',
        subject: 'Contact Us Request',
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        color: req.body.color,
        message: req.body.message
    }, function(err) {
        if (err) {
          // handle error
          console.log(err);
          //TODO: Add this back in when ready for prime time
          //res.status(500).send({ errorMessage: 'There was an error sending the email' });
          res.status(200).send({});
          
        } else {
          res.status(200).send({});
        }
    
    });
});

router.post('/subscribe', function(req, res) {
  var db = req.db,
      collection = db.collection('Subscribers'),
      name = req.body.name || '',
      email = req.body.email;

    //TODO: Add server side validation
    if(!email) {
      res.status(500).send(err);
      return;
    }

    db.collection('Subscribers').insertOne({
      emailAddress: email,
      name: name
    }, function(err, results) {
      if(!err) {
        res.status(200).send({}); 
      } else {
        res.status(500).send(err);
      }
     // db.close();
    });
});

router.post('/unsubscribe', function(req, res) {
    var db = req.db;
    deleteSubscriber(db, req.body.email, function(err, result) {
      if(!err) {
        res.status(200).send({}); 
      } else {
        res.status(500).send(err);
      }
      //db.close();
    });
    
});

/* GET Userlist page. */
router.get('/subscribers', function(req, res) {
    var db = req.db;
    var collection = db.collection('Subscribers');
    collection.find({}).toArray(function(err,docs){
      console.log(docs);
      res.status(200).send({
          "subscribers" : docs
      });
     // db.close();
    });
});



module.exports = router;