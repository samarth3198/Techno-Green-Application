//var user = require('../model/user');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  userId: {type: Number},
  firstName: {type: String},
  lastName: {type: String},
  email: {type:String},
  password: {type:String}
});

var Users = mongoose.model('users', userSchema);


// Loading all hardcoded users when the user signs in
async function getUsers(){
     var allUsers = await Users.find({}, (err, data) => {
            console.log('All Users'+JSON.stringify(data));
            if(err){
                console.error(err);
            }
            return data;
     })
     return allUsers;
 }

async function getUserByEmail(username){

    var user = await Users.findOne({email: username}, (err, data) => {
        console.log('data is :' + data);
        return data;
    });

    return user;
}

module.exports = {getUsers, getUserByEmail};

