Ext.define('Matrix.Step', {
    extend:'Ext.data.Model',
    fields:[
        {name:'text', type:'string'},
        {name:'speed', type:'int', defaultValue:10}
    ],
    belongsTo:'Matrix.Sequence'
});
