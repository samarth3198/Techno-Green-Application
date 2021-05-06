var meetupObj = require('./connectionDB');
var userDBObj = require('./userDB');
var userProfile = require('../model/userProfile');
var userConnection = require('../model/userConnection');
var express = require('express');
var router = express.Router();
var session = require('express-session');

// Creating the session object
router.use(session({
    secret: 'meetupSession',
    cookie: { secure: true }
}));

//adding meetups to the list of user registered meetups
async function addMeetups(meetupId, rsvp, userId){

    var event = await meetupObj.getConnectionById(meetupId);
    console.log('Meetup to add is:'+ JSON.stringify(event));
    await userProfile.addConnectionToUser(event.Id, event.Name, event.topic, rsvp, userId);
    console.log('Event with id ${meetupId} added to the user profile');
    var userRegisteredMeetups = await userProfileConnections(userId);
    console.log('Displaying user registered meetups' + JSON.stringify(userRegisteredMeetups));
    return userRegisteredMeetups;
}


//Deletion of meetups
async function removeMeetups(meetupId, userId) {

    await userProfile.deleteUserProfileConnections(meetupId, userId);
    return userProfileConnections(userId);
}


//update meetups rsvp
async function updateMeetups(meetupId, rsvp, userConnection, userId) {

    await userProfile.updateUserProfileConnections(meetupId, userId, rsvp);
    var userConnection = await userProfileConnections(userId);
    return userConnection;
}


// Loading the connections first time when the user logs in/signs up/ session starts
async function getConnections() {

    var users = userDBObj.getUsers();
    return users;
}

async function getUserByEmail(username){

    var user = await userDBObj.getUserByEmail(username);
    console.log('user is:' + user);
    return user;
}

// Emptying the profile upon SignOut
async function emptyProfile(sessionObj) {

    console.log(`Session object destroyed`);
    sessionObj.destroy();
}

//get userprofile meetups
async function userProfileConnections(userId){

    var events = await userProfile.getUserProfileConnections(userId);
    console.log('Service class' + JSON.stringify(events));
    return events;
}


// checking if the meetup is already registred and returns true if present or false if it is not present
async function checkMeetupRegistered(meetupId, userConnection) {

    var event = await userConnection.find(x => x.meetupId === meetupId);

    if (event == null || event == undefined) {
        console.log('Selected meetup is not present in user registered meetups');
        return false;
    }
    console.log('Selected meetup present in user registered meetups');
    return true;

}

module.exports = { checkMeetupRegistered, userProfileConnections, emptyProfile, getConnections, updateMeetups, removeMeetups, addMeetups, getUserByEmail };
