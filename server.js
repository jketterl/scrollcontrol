var express = require('express'),
    mongoose = require('mongoose'),
    Sequence = require('./sequence');

var app = express();
app.use(express.static(__dirname + '/ws'));
app.use(express.bodyParser());

var matrix = new (require('./matrix'))();

app.post('/direct', function(req, res){
    matrix.displaySequence(req.body);
    res.json({success:true});
});
app.post('/sequence', function(req, res){
    console.info(req.body);
    res.json({success:true});
});

mongoose.connect('mongodb://localhost/scrollcontrol');
var db = mongoose.connection;
db.on('open', function(){
    app.listen(3000, function(){
        console.info('Server started.');
    });
});
db.on('error', function(err){
    console.error(err.stack);
});
