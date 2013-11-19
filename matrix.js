var fs = require('fs'),
    Sequence = require('./sequence');

var Matrix = module.exports = function(){
    var me = this;
    me.stream = fs.createWriteStream('/dev/spidev0.0');
    me.displaySequence(new Sequence({steps:[{
        text:'scroll control enabled :-)',
        speed:50
    },{
        text:'ready',
        speed:10
    },{
        text:'waiting for input',
        speed:10
    }]}));
};

Matrix.prototype.displaySequence = function(sequence){
    this.write(sequence.getBinary());
}

Matrix.prototype.write = function(text) {
    this.stream.write(text); 
}
