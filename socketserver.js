var net = require('net');

var SocketServer = function() {
    var me = this;
    me.sockets = [];
    var server = net.createServer(function(socket){
        me.sockets.push(socket);
        socket.on('close', function(){
            var index = me.sockets.indexOf(socket);
            if (index < 0) return;
            me.sockets.splice(index, 1);
        });
        socket.on('error', function(err) {
            console.error('socket error:\n' + err.stack);
        });
        if (me.sequence) socket.write(me.sequence.getBinary());
    });
    server.listen(1337);
};

module.exports = SocketServer;

SocketServer.prototype.displaySequence = function(sequence) {
    this.sequence = sequence;
    this.sockets.forEach(function(socket){
        socket.write(sequence.getBinary());
    });
};
