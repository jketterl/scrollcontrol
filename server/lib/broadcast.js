var dgram = require('dgram');

var BroadcastListener = function(port) {
    var socket = dgram.createSocket({type: 'udp4', reuseAddr: true});
    socket.on('message', function(buf, rinfo) {
        if (buf.toString() != "hello scrollcontrol") return;
        socket.send("hello client", rinfo.port, rinfo.address);
    });
    socket.bind(1337);
}

module.exports = BroadcastListener;
