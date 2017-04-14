var Sequence = require('./sequence');

var initialSequence = new Sequence({steps:[{
    text:'scroll control enabled :-)',
    animations:[{
        type:'SCROLL_IN',
        direction:'RIGHT',
        speed:50
    },{
        type:'SCROLL_OUT',
        direction:'LEFT',
        speed:50
    }]
},{
    text:'ready',
    animations:[{
        type:'SCROLL_IN',
        direction:'BOTTOM',
        speed:1
    }, {
        type:'HOLD',
        speed:30
    },{
        type:'SCROLL_OUT',
        direction:'TOP',
        speed:1
    }]
},{
    text:'waiting for input',
    animations:[{
        type:'HOLD',
        speed:50
    }]
}]});

module.exports = initialSequence;
