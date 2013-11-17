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
    var sequence = new Sequence(req.body);
    sequence.save(function(err){
        if (err) {
            console.error(err.stack);
            return res.json({success:false}, 500);
        }
        res.json({success:true, data:sequence});
    });
});
app.put('/sequence/:id', function(req, res){
    Sequence.findOne({"_id":req.params.id}, function(err, sequence){
        if (err) {
            console.error(err.stack);
            return res.json({success:false}, 500);
        }
        for (var a in req.body) sequence[a] = req.body[a];
        sequence.save(function(err){
            if (err) {
                console.error(err.stack);
                return res.json({success:false}, 500);
            }
            res.json({success:true, data:sequence});
        })
    });
});
app.delete('/sequence/:id', function(req, res){
    Sequence.findOne({"_id":req.params.id}, function(err, sequence){
        if (err) {
            console.error(err.stack);
            return res.json({success:false}, 500);
        }
        sequence.remove(function(err){
            if (err) {
                console.error(err.stack);
                return res.json({success:false}, 500);
            }
            res.json({success:true});
        });
    });
});
app.get('/sequence', function(req, res){
    Sequence.find(function(err, result){
        if (err) {
            console.error(err.stack);
            return res.json({success:false}, 500);
        }
        res.json({success:true, data:result});
    });
});
app.get('/sequence/:id/start', function(req, res){
    Sequence.findOne({"_id":req.params.id}, function(err, sequence){
        if (err) {
            console.error(err.stack);
            return res.json({success:false}, 500);
        }
        matrix.displaySequence(sequence.steps);
        res.json({success:true});
    });
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
