var meetupObject = require('../model/connection');

//Function to get all topics added so far
async function getAllCategories(){

    var categories = [];

    await meetupObject.Events.find({}, {topic: 1}, (err, data) => {
        //console.log('events data :' + data);
        data.forEach(x => {
            categories.push(x.topic);
            //console.log('categories individual is:' + categories);
        });
        return categories;
        
    });
    return Array.from(new Set(categories));
}

//Function to get all meetups
async function getAll(){
    var connection = await meetupObject.Events.find({},(err, data) => {
        //console.log('data is:' + data);
        return data;
    })
    return connection;
}

//Function to get meetup by Id
async function getConnectionById(id){
    var connection  = await meetupObject.Events.findOne({"Id": id}, (err, data) => {
        if(err){
            return err;
        }
       return data;
    })
    return connection;
}

//Function to add meetup by Id
async function addConnection(body){

    var meetupId = await meetupObject.Counters.findOne({sequenceValue : 0}, (err, data) => {
        return data;
    })

    var newConnectionId = parseInt(meetupId.sequence_value)+1;
    await meetupObject.Counters.update({sequenceValue : 0}, {$set : {sequence_value: newConnectionId}}, (err, data) => {
        console.log('Counters Increment Updated Successfully');
    });

    var addNewConnection = new meetupObject.Events({"Id": newConnectionId, "Name": body.name, "topic":body.topic, "details": body.details, "date": body.date, "time":body.time});
    await addNewConnection.save();

 }

 module.exports = { getAllCategories, getConnectionById, addConnection, getAll };


