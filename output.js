var initialSequence = require('./initialSequence'),
    Matrix = require('./matrix'),
    net = require('net');

var Output = function(){
    var me = this;
    me.config = require('./config.json');
    me.matrix = new Matrix();
    me.sockets = [];

    var connect = function(ip){
        console.info('connecting to ' + ip);
        var sock = net.connect(6571, ip, function(){
            console.info('connected to ' + ip);
            if (me.sequence) sock.write(me.sequence.getBinary());
            me.sockets.push(sock);
        });
        sock.on('error', function(err){
            console.error('Error on socket ' + ip + ':\n' + err.stack);
        });
        sock.on('close', function(){
            console.info('socket ' + ip + ' closed, reconnecting in 10 seconds...');
            setTimeout(function(){
                connect(ip);
            }, 10000);

            var index = me.sockets.indexOf(sock);
            if (index < 0) return;
            me.sockets.splice(index, 1);
        });
    };

    me.config.sockets.forEach(connect);
};

module.exports = Output;

Output.prototype.displaySequence = function(sequence) {
    this.sequence = sequence;
    this.matrix.displaySequence(sequence);
    this.sockets.forEach(function(sock){
        sock.write(sequence.getBinary());
    });
};

Output.prototype.displayMessage = function(message) {
    this.displaySequenece(new Sequence({
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
