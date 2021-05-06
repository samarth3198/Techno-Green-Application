var express = require('express');
var router = express.Router();
var session = require('express-session');
var userProfile = require('../utility/userService');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({ extended: false});
const {check, validationResult } = require('express-validator');

router.use(session({
    secret: 'eventSession',
    cookie: { secure: true }
}));


router.get('/login', urlEncodedParser, [
    check('action').equals('Login').withMessage('Please login through the login form'),
    check('username').custom((value, {req }) => {
        //console.log('getting into userprofile');
        return userProfile.getUserByEmail(value).then(user => {
            console.log('getting into user to check' + user);
            if(user === null || user === undefined) {
                throw new Error('Username does not match!');
            } else if (user.email !== req.query.username || user.password !== req.query.password) {
                throw new Error('Username and Password does not match');
            }
        })
    })
], async(req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log('abc');
        return res.render('login', { loggedIn: (req.session.users) ? true : false, errors: errors.array() });
    }else {
        
        req.session.users = await userProfile.getUserByEmail(req.query.username);

        req.session.userId = req.session.users.userId;
        req.session.userName = req.session.users.firstName;

        console.log(`User Logged In with Id: ${req.session.userId} and Name: ${req.session.userName}`);

        req.session.userEvents = await userProfile.userProfileConnections(req.session.userId);

        res.render('savedConnections', { userEvents: req.session.userEvents, userName: req.session.userName});
    }
});


//Lodaing the default connections when session starts
router.get('/myConnections', async (req, res) => {
        res.render('savedConnections', { userEvents: req.session.userEvents, userName: req.session.userName });
});

router.get('/save', [
    check('userEvents').custom((value, {req}) => {
        if(req.session.userEvents === null || req.session.userEvents === undefined){
            throw new Error('Please register for the meetup after you login')
        }else{
            return true;
        }
    })
], async (req, res) => {    

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        //console.log('Inside error loop seeing what happens');
        return res.render('login', { loggedIn: (req.session.users) ? true : false, errors: errors.array() });
    }    

    var id = parseInt(req.query.meetupId);
    var rsvp = req.query.rsvp;

    req.session.meetupId = id;
    req.session.rsvp = rsvp;

    //Redireting to the index page if user is not logged in
    if (req.session.userEvents == null || req.session.userEvents == undefined) {
        return res.redirect('/login');
    }
    var status = await userProfile.checkMeetupRegistered(id, req.session.userEvents);
    console.log("status"+status);
    if (status) {
        //Redirecting the request to update if the event is already registered
        return res.redirect('./update');

    } else {
        //adding the meetup to the already registered meetups
        req.session.userEvents = await userProfile.addMeetups(id, rsvp, req.session.userId, req.session.userEvents);
    }
    res.render('savedConnections', { userEvents: req.session.userEvents, userName: req.session.userName });

});

router.get('/update', async (req, res) => {

    req.session.userEvents = await userProfile.updateMeetups(req.session.meetupId, req.session.rsvp, req.session.userEvents, req.session.userId);
    res.render('savedConnections', { userEvents: req.session.userEvents, userName: req.session.userName });
});

router.get('/delete', async (req, res) => {
    console.log(req.query.meetupId);
    var id = parseInt(req.query.meetupId);

    console.log(`Event with Id ${id} deleted ${req.session.userEvents}`);
    req.session.userEvents = await userProfile.removeMeetups(id, req.session.userId, req.session.userEvents);

    res.render('savedConnections', { userEvents: req.session.userEvents, userName: req.session.userName });
});

router.get('/signout', async (req, res) => {

    await userProfile.emptyProfile(req.session);
    return res.redirect('/index');
});

module.exports = router;