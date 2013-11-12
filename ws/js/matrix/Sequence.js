Ext.define('Matrix.Sequence', {
    extend:'Ext.data.Model',
    fields:[
        {name:'id', type:'integer'}
    ],
    hasMany:{model:'Matrix.Step', name:'steps'}
});
