var express = require('express');

var app = express();
app.use(express.static(__dirname + '/ws'));
app.use(express.bodyParser());

var matrix = new (require('./matrix'))();

app.post('/direct', function(req, res){
    matrix.displaySequence([req.body]);
    res.json({status:'OK'});
});

app.listen(3000);
