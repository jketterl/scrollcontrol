Ext.define('Matrix.Sequence', {
    extend:'Ext.data.Model',
    fields:[
        //{name:'id', type:'integer'},
        {name:'name', type:'string'}
    ],
    hasMany:{model:'Matrix.Step', name:'steps'},
    proxy:{
        type:'rest',
        url:'/sequence'
    }
});
