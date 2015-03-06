var fs = require('fs');

var Matrix = module.exports = function(){
    var me = this;
    me.stream = fs.createWriteStream('/dev/spidev0.0');
}

Matrix.prototype.displaySequence = function(sequence){
    var me = this,
        buf = sequence.getBinary(),
        chunkSize = 60;

    var write = function(start) {
        var end = start + chunkSize;
        var finished = false;
        if (end > buf.length) {
            end = buf.length;
            finished = true;
        }
        var chunk = buf.slice(start, end);
        var next = function(){
            setTimeout(function(){
                write(end);
            }, 100);
        };
        var flushed = me.stream.write(chunk);
        if (finished) return;
        if (flushed) next(); else me.stream.once('drain', next);
    };

    write(0);

};
