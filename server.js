var express = require('express'),
    mongoose = require('mongoose'),
    Sequence = require('./sequence'),
    child_process = require('child_process');

var app = express();
app.use(express.static(__dirname + '/ws'));
app.use(express.bodyParser());

var matrix = new (require('./matrix'))();

app.post('/direct', function(req, res){
    var sequence = new Sequence(req.body);
    matrix.displaySequence(sequence);
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
        matrix.displaySequence(sequence);
        res.json({success:true});
    });
});

var startServer = function(){
    app.listen(3000, function(){
        console.info('Server started.');
        matrix.displayInitialSequence();
    });
};

mongoose.connect('mongodb://localhost/scrollcontrol');
var db = mongoose.connection;
db.on('open', startServer);
db.on('error', function(err){
    console.warn('database error');
    matrix.displayMessage('database repair');
    var repair = child_process.spawn(__dirname + '/dbrepair.sh');
    repair.on('exit', function(rc){
        if (rc != 0) {
            matrix.displayMessage('database error');
            process.exit(1);
        }
        console.warn('database repaired.');
        matrix.displayMessage('database ok');
        mongoose.connect('mongodb://localhost/scrollcontrol');
    });
});
