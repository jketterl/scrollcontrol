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

var directions = ['LEFT', 'RIGHT', 'TOP', 'BOTTOM'];
var types = ['SCROLL_IN', 'SCROLL_OUT', 'HOLD']; 

schema.methods.getBinary = function(){
    var me = this;

    // first byte: number of steps
    var buf = new Buffer(1);
    buf[0] = me.steps.length;
    var buffers = [buf];
    me.steps.forEach(function(line){
        // 3-byte header for each step
        var buf = new Buffer(line.text.length + 3);
        // type - only 0 is supported for now
        buf[0] = 0;
        // speed
        buf[1] = Math.max(0, Math.min(255, line.speed));
        // length of following text
        buf[2] = line.text.length;
        // text
        buf.write(line.text, 3);
        buffers.push(buf);

        var animations = line.animations || [];
        // another byte with the number of animations
        var buf = new Buffer(1);
        buf[0] = animations.length;
        buffers.push(buf);
        animations.forEach(function(anim){
            // each animation is represented by 3 bytes
            var buf = new Buffer(3);
            // type
            buf[0] = types.indexOf(anim.type);
            // direction
            buf[1] = directions.indexOf(anim.direction);
            // speed
            buf[2] = anim.speed;
            buffers.push(buf);
        });
    });
    var binary = Buffer.concat(buffers);
    console.info(binary);
    return binary;
};

var Sequence = module.exports = mongoose.model('Sequence', schema);
