var Sequence = require('./sequence'),
    initialSequence = require('./initialSequence'),
    Matrix = require('./matrix'),
    SocketServer = require('./socketserver'),
    net = require('net');

var Output = function(){
    var me = this;
    me.matrix = new Matrix();
    me.socketServer = new SocketServer();
};

module.exports = Output;

Output.prototype.displaySequence = function(sequence) {
    this.matrix.displaySequence(sequence);
    this.socketServer.displaySequence(sequence);
};

Output.prototype.displayMessage = function(message) {
    this.displaySequence(new Sequence({
        steps:[{
            text:message,
            animations:[{
                type:'HOLD',
                speed:100
            }]
        }]
    }));
};

Output.prototype.displayInitialSequence = function() {
    this.displaySequence(initialSequence);
};
