var express = require('express'),
    app = express(),
    http = require('http'),
    mailer = require('express-mailer'),
    bodyParser = require('body-parser'),
    //mongo = require('mongodb'),
   // monk = require('monk'),
    //db = monk('localhost:27017/test'),
    routes = require('./routes/index'),
    MongoClient = require('mongodb').MongoClient,
    dbConn;

MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
    if (err) { throw err; }
    dbConn = db;

  // db.collection('mammals').find().toArray(function (err, result) {
  //   if (err) throw err

  //   console.log(result)
  // })
});

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


//app.use('/users', users);

app.use(function(req,res,next) {
    console.log('Time:', Date.now());
    next();
});



// Setup response headers
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

app.use(bodyParser.json());

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = dbConn;
    req.mailer = app.mailer;
    next();
});

app.use('/', routes);

// app.use(function (err, req, res, next) {
//   console.error(err.stack)
//   res.status(500).send('Something broke!')
// });

//TODO: Do we need these error handlers?
/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log('Dev Error: ' + err);
        // res.render('error', {
        //     message: err.message,
        //     error: err
        // });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log('Prod Error: ' + err);
    // res.render('error', {
    //     message: err.message,
    //     error: {}
    // });
});

app.listen(3001, function(){
    console.log("All right ! I am alive at Port 3001.");
});