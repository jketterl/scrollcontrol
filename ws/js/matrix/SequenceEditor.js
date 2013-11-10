Ext.define('Matrix.SequenceEditor', {
    extend:'Ext.form.Panel',
    frame:true,
    items:[{
        xtype:'textfield',
        name:'text',
        fieldLabel:'Scroll text'
    },{
        xtype:'slider',
        name:'speed',
        fieldLabel:'Scroll speed',
        width:400,
        value:10,
        maxValue:255
    }],
    dockedItems:[{
        xtype:'toolbar',
        dock:'top',
        items:[{
            xtype:'button',
            text:'Send to display',
            handler:function(){
                var form = this.up('form');
                form.submit();
           }
        }]
    }],
    listeners: {
        afterRender: function(thisForm, options){
            this.keyNav = Ext.create('Ext.util.KeyNav', this.el, {                    
                enter: function(){
                    this.submit();
                },
                scope: this
            });
        }
    },
    submit:function(){
        Ext.Ajax.request({
            url:'/direct',
            jsonData:this.getForm().getValues()
        });
    }
});

