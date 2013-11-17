Ext.define('Matrix.Sequence', {
    extend:'Ext.data.Model',
    requires:[
        'Matrix.SequenceWriter'
    ],
    fields:[
        {name:'id', type:'String', mapping:'_id'},
        {name:'name', type:'string'}
    ],
    hasMany:{model:'Matrix.Step', name:'steps'},
    proxy:{
        type:'rest',
        url:'/sequence',
        writer:'sequencewriter',
        reader:{
            root:'data'
        }
    },
    play:function(){
        Ext.Ajax.request({
            url:'/sequence/' + this.get('id') + '/start'
        });
    }
});
