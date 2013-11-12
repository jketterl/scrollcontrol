Ext.define('Matrix.StepEditor', {
    extend:'Ext.form.Panel',
    frame:true,
    initComponent:function(){
        var me = this;

        me.items = [{
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
        }]

        me.callParent(arguments);
        
        me.items.each(function(item){
            item.on('change', function(){
                me.getForm().updateRecord(me.step);
            });
        });
    },
    loadStep:function(step){
        this.step = step;
        this.getForm().loadRecord(step);
    }
});

