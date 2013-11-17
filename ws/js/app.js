var app = function(){
    Ext.Loader.setConfig({
        enabled:true,
        paths:{
            'Matrix':'js/matrix'
        }
    });

    var content = Ext.create('Ext.container.Container', {
        layout:'card',
        region:'center',
        show:function(component){
            this.add(component);
            this.getLayout().setActiveItem(component);
        }
    });

    var editor =  Ext.create('Matrix.SequenceEditor', {
        title:'Sequence Editor',
        region:'center'
    });

    var grid = Ext.create('Ext.grid.Panel', {
        title:'Stored Sequences',
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
            {header:'Name', dataIndex:'name', flex:3}
        ],
        store:{
            model:'Matrix.Sequence',
            autoLoad:true
        }
    });

    grid.on('activate', function(){
        grid.getStore().load();
    });

    var viewport = Ext.create('Ext.Viewport', {
        layout:'border',
        items:[
            Ext.create('Ext.tree.Panel', {
                region:'west',
                title:'Navigation',
                width:200,
                split:true,
                rootVisible:false,
                collapsible:true,
                store:Ext.create('Ext.data.TreeStore', {
                    fields:['text', 'leaf', 'handler'],
                    root:{
                        expanded:true,
                        children:[{
                            text:'Direct Mode',
                            leaf:true,
                            handler:function(){
                                editor.loadSequence(Ext.create('Matrix.Sequence'));
                                content.show(editor);
                            }
                        },{
                            text:'Stored Sequences',
                            leaf:true,
                            handler:function(){
                                content.show(grid);
                            }
                        }]
                    }
                }),
                listeners:{
                    itemclick:function(tree, record){
                        var fn = record.get('handler');
                        if (fn) fn();
                    }
                }
            }),
            content
        ]
    });
};

Ext.onReady(app);
