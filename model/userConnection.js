var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userConnectionSchema = new Schema({
    meetupId: {type: Number, unique: true},
    userId: {type: Number, unique: true},
    meetupName: {type: String},
    topic: {type: String},
    rsvp: {type: String}
});

var userevents = mongoose.model('userevents',userConnectionSchema);

module.exports.userevents = userevents;