Ext.define('Matrix.Animation', {
    extend:'Ext.data.Model',
    fields:[
        {name:'type', type:'String'},
        {name:'direction', type:'String'},
        {name:'speed', type:'Number', defaultValue:10}
    ],
    belongsTo:'Matrix.Step'
});
