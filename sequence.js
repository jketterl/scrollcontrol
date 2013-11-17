var mongoose = require('mongoose');

var Sequence = module.exports = mongoose.model('Sequence', mongoose.Schema({
    name:String,
    steps:[{
        text:String,
        speed:Number
    }]
}));