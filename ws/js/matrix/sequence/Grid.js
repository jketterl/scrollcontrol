Ext.define('Matrix.sequence.Grid', {
    extend:'Ext.grid.Panel',
    columns:[
        {header:'ID', dataIndex:'id', flex:1},
        {header:'Aktionen', xtype:'actioncolumn', items:[{
            icon:'img/icons/layout_edit.png',
            tooltip:'Bearbeiten',
            handler:function(grid, rowIndex){
                var sequence = grid.getStore().getAt(rowIndex);
                editor.loadSequence(sequence);
                content.show(editor);
            }
        },{
            icon:'img/icons/control_play_blue.png',
            tooltip:'Starten',
            handler:function(grid, rowIndex){
                var sequence = grid.getStore().getAt(rowIndex);
                Ext.Ajax.request({
                    url:'/sequence/' + sequence.get('id') + '/start'
                });
            }
        }]},
        {
            header:'Text',
            dataIndex:'steps',
            flex:4,
            renderer:function(v, r, record){
                var texts = [];
                record.steps().each(function(){
                    texts.push(this.get('text'));
                });
                return texts.join(' // ');
            }
        }
    ],
    store:{
        model:'Matrix.Sequence',
        autoLoad:true
    },
    initComponent:function(){
        var me = this;
        me.callParent(arguments);
        me.on('activate', function(){
            me.getStore().load();
        });
    }
});
