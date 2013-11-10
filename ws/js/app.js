var app = function(){
    Ext.Loader.setConfig({
        enabled:true,
        paths:{
            'Matrix':'js/matrix'
        }
    });

    var viewport = Ext.create('Ext.Viewport', {
        layout:'border',
        items:[Ext.create('Ext.tree.Panel', {
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
                            console.info('direct mode');
                        }
                    },{
                        text:'Stored Sequences',
                        leaf:true
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
        Ext.create('Matrix.SequenceEditor', {
            title:'Direct mode',
            region:'center'
        })]
    });
};

Ext.onReady(app);
