var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var connectionSchema = new Schema({
   Id: {type: Number},
   Name : {type: String},
   topic : {type: String},
   details : {type: String},
   date : {type: String},
   time : {type: String},
});

var counterSchema = new Schema({
  _id: {type: String},
  sequenceValue: {type: Number},
  sequence_value: {type: Number}
});

var Events = mongoose.model('events', connectionSchema);

var Counters = mongoose.model('counters', counterSchema);

module.exports.Events = Events;
module.exports.Counters = Counters;