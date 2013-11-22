Ext.define('Matrix.Step', {
    extend:'Ext.data.Model',
    requires:['Matrix.Animation'],
    fields:[
        {name:'text', type:'string'},
    ],
    hasMany:{model:'Matrix.Animation', name:'animations'},
    belongsTo:'Matrix.Sequence'
});
