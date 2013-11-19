var mongoose = require('mongoose');

var schema = mongoose.Schema({
    name:String,
    steps:[{
        text:String,
        speed:Number,
        animations:[{
            type:{type:String},
            direction:String,
            speed:Number
        }]
    }]
});

schema.methods.getBinary = function(){
    var me = this;
    var buf = new Buffer(1);
    buf[0] = me.steps.length;
    var buffers = [buf];
    me.steps.forEach(function(line){
        var buf = new Buffer(line.text.length + 3);
        buf[0] = 0;
        buf[1] = Math.max(0, Math.min(255, line.speed));
        buf[2] = line.text.length;
        buf.write(line.text, 3);
        buffers.push(buf);
    });
    console.info(buffers);
    return Buffer.concat(buffers);
};

var Sequence = module.exports = mongoose.model('Sequence', schema);
