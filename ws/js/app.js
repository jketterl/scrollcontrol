var app = function(){
    Ext.Loader.setConfig({
        enabled:true,
        paths:{
            'Matrix':'js/matrix'
        }
    });

    var viewport = Ext.create('Ext.Viewport', {
        layout:'border',
        items:[{
            region:'west',
            title:'Navigation',
            width:200,
            split:true,
            collapsible:true
        },Ext.create('Matrix.SequenceEditor', {
            title:'Direct mode',
            region:'center'
        })]
    });
};

Ext.onReady(app);
