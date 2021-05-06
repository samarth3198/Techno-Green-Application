var express = require('express');
var app = express();
var session = require('express-session');
var mongoose = require('mongoose');

//Connecting to the local database that have been created named meetup
mongoose.connect('mongodb://localhost/kashmira', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
    console.log('Connected to the technogreen database');
});

app.set('view engine', 'ejs');
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));

var addConnectionRouter = require('./controller/addConnectionController');
var connectionsRouter = require('./controller/connectionController');
var userProfileRouter = require('./controller/userController');

app.use(session({secret: 'user'}));

app.use('/connections',connectionsRouter);
app.use('/savedConnections', userProfileRouter);
app.use('/addConnection', addConnectionRouter);
app.use('/signout', userProfileRouter);


//Route to index page
app.get('/index', function(req,res) {
    res.render('index', {loggedIn : (req.session.users) ? true: false});
});

//Route to about page
app.get('/about', function(req,res) {
    res.render('about', {loggedIn : (req.session.users) ? true: false});
});

//Route to contact page
app.get('/contact', function(req,res) {
    res.render('contact', {loggedIn : (req.session.users) ? true: false});
});

//Route to login page
app.get('/login', function(req,res) {
    res.render('login', { errors: false, loggedIn : (req.session.users) ? true: false});
});


//Route to register for a newconnection 
app.get('/newConnection', function(req,res) {
    res.render('newConnection', {loggedIn : (req.session.users) ? true: false, errors : false});
});

app.get('/*', function(req,res) {
    res.render('index', {loggedIn : (req.session.users) ? true: false});
});

app.listen(8084);

