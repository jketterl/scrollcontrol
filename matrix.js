var fs = require('fs');

var Matrix = module.exports = function(){
    var me = this;
    me.stream = fs.createWriteStream('/dev/spidev0.0');
    me.displaySequence([{
        text:'scroll control enabled :-)',
        speed:50
    },{
        text:'ready',
        speed:10
    },{
        text:'waiting for input',
        speed:10
    }]);
};

Matrix.prototype.displaySequence = function(sequence){
    var me = this;
    var buf = new Buffer(1);
    buf[0] = sequence.length;
    var buffers = [buf];
    sequence.forEach(function(line){
        var buf = new Buffer(line.text.length + 3);
        buf[0] = 0;
        buf[1] = Math.max(0, Math.min(255, line.speed));
        buf[2] = line.text.length;
        buf.write(line.text, 3);
        buffers.push(buf);
    });
    console.info(buffers);
    me.write(Buffer.concat(buffers));
}

Matrix.prototype.write = function(text) {
    this.stream.write(text); 
}
