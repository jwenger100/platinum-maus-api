var express = require('express'),
    app = express(),
    http = require('http'),
    mailer = require('express-mailer'),
    bodyParser = require('body-parser');

mailer.extend(app, {
    from: 'no-reply@platinummaus.com',
    host: 'smtp.gmail.com',
    secureConnection: true,
    port: 465,
    transportMethod: 'SMTP',
    auth: {
        user: 'jon.wenger@gmail.com',
        pass: '!'
    }
});

//Set template view engine to Jade for email rendering
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(function(req,res,next) {
    console.log('Time:', Date.now());
    next();
});

app.use(bodyParser.json());
//app.use(express.json());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.use(allowCrossDomain);


app.post('/contactUs', function(req, res) {
    app.mailer.send('email', {
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
          res.status(500).send('There was an error sending the email');
          return;
        }
        res.status(200).send();
    });
});

app.post('/subscribeToMailer', function(req, res) {
    console.log(req.body.email);
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

//console.log('Starting Server... Port 80');

//http.createServer(app).listen(80);
app.listen(3001, function(){
    console.log("All right ! I am alive at Port 3001.");
});