Ext.define('Matrix.sequence.Grid', {
    extend:'Ext.grid.Panel',
    store:{
        model:'Matrix.Sequence',
        autoLoad:true
    },
    initComponent:function(){
        var me = this;

        me.dockedItems = [{
            dock:'top',
            xtype:'toolbar',
            items:[{
                xtype:'button',
                text:'Starten',
                handler:function(){
                    var record = me.getSelectionModel().getSelection()[0];
                    if (!record) return;
                    record.play();
                }
            },{
                xtype:'button',
                text:'Bearbeiten',
                handler:function(){
                    var record = me.getSelectionModel().getSelection()[0];
                    if (!record) return;
                    me.edit(record);
                }
            },{
                xtype:'button',
                text:'Löschen',
                handler:function(){
                    var record = me.getSelectionModel().getSelection()[0];
                    if (!record) return;
                    Ext.Msg.show({
                        title:'Löschen',
                        msg:'Sind Sie sicher?',
                        buttons:Ext.Msg.YESNO,
                        icon:Ext.Msg.QUESTION,
                        fn:function(button){
                            if (button == 'yes') record.destroy();
                        }
                    })
                }
            }]
        }];

        me.columns = [
            {header:'ID', dataIndex:'id', flex:1},
            {header:'Aktionen', xtype:'actioncolumn', items:[{
                icon:'img/icons/layout_edit.png',
                tooltip:'Bearbeiten',
                handler:function(grid, rowIndex){
                    var sequence = grid.getStore().getAt(rowIndex);
                    me.edit(sequence);
                }
            },{
                icon:'img/icons/control_play_blue.png',
                tooltip:'Starten',
                handler:function(grid, rowIndex){
                    var sequence = grid.getStore().getAt(rowIndex);
                    sequence.play();
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
        ];

        me.callParent(arguments);
        me.on('activate', function(){
            me.getStore().load();
        });
    },
    edit:Ext.emptyFn
});
