var userConnection = require('./userConnection');

//adding connection to the user profile that is to usermeetup collection
async function addConnectionToUser(meetupId, meetupName, topic, rsvp, userId){
  //console.log("meetupId............"+ meetupId+ "meetupName...."+ meetupName+  "topic......."+ topic+ "rsvp......."+ rsvp+"userId..."+ userId)  
  var addconnection = new userConnection.userevents({"meetupId": meetupId, "meetupName": meetupName,  "topic": topic, "rsvp": rsvp, "userId": userId});
  await addconnection.save();

}

// Updating the User Registered connections
async function updateUserProfileConnections(meetupId, userId, rsvp){
    
  await userConnection.userevents.update({"meetupId": meetupId,"userId":userId}, {$set : {rsvp: rsvp}}, (err, data) => {
  });
}

//Deleting the connection from user profile 
async function deleteUserProfileConnections(meetupId, userId){

  await userConnection.userevents.remove({userId: userId, meetupId: meetupId}, (err, data) => {
  console.log(`$Deleted connection with ID:${meetupId} from the UserId:${userId}`);
  });
}

// Get the connections associated with the particular User Id
async function getUserProfileConnections(id){
  var userProfileConnections = await userConnection.userevents.find({userId:id}, (err, data) => { 
      //console.log("data: "+data); 
      return data;
  });

  return userProfileConnections;
}

module.exports = {addConnectionToUser, deleteUserProfileConnections, getUserProfileConnections, updateUserProfileConnections};

