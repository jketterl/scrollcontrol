var fs = require('fs'),
    Sequence = require('./sequence');

var Matrix = module.exports = function(){
    var me = this;
    me.stream = fs.createWriteStream('/dev/spidev0.0');
    me.displaySequence(new Sequence({steps:[{
        text:'scroll control enabled :-)',
        animations:[{
            type:'SCROLL_IN',
            direction:'RIGHT',
            speed:50
        },{
            type:'SCROLL_OUT',
            direction:'LEFT',
            speed:50
        }]
    },{
        text:'ready',
        animations:[{
            type:'SCROLL_IN',
            direction:'BOTTOM',
            speed:1
        }, {
            type:'HOLD',
            speed:30
        },{
            type:'SCROLL_OUT',
            direction:'TOP',
            speed:1
        }]
    },{
        text:'waiting for input',
        animations:[{
            type:'HOLD',
            speed:50
        }]
    }]}));
};

Matrix.prototype.displaySequence = function(sequence){
    var me = this,
        buf = sequence.getBinary(),
        chunkSize = 20;

    var write = function(start) {
        var end = start + chunkSize;
        var finished = false;
        if (end > buf.length) {
            end = buf.length;
            finished = true;
        }
        var chunk = buf.slice(start, end);
        me.stream.write(chunk);
        if (!finished) setTimeout(function(){
            write(end);
        }, 10);
    };

    write(0);
}
