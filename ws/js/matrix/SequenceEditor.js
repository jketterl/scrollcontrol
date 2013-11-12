Ext.require([
    'Matrix.Sequence',
    'Matrix.Step'
], function(){
    Ext.define('Matrix.SequenceEditor', {
        extend:'Ext.panel.Panel',
        layout:'border',
        initComponent:function(){
            var me = this;

            this.sequence = Ext.create('Matrix.Sequence');
            var stepStore = this.sequence.steps();

            var stepEditor = Ext.create('Matrix.StepEditor', {
                region:'center',
            });

            var grid = Ext.create('Ext.grid.Panel', {
                region:'west',
                width:200,
                split:true,
                store:stepStore,
                columns:[
                    {header:'text', dataIndex:'text', flex:1}
                ],
                dockedItems:[{
                    dock:'bottom',
                    xtype:'toolbar',
                    items:[{
                        xtype:'button',
                        text:'+',
                        flex:1,
                        handler:function(){
                            var step = Ext.create('Matrix.Step');
                            stepStore.add(step);
                            grid.getSelectionModel().select(step);
                        }
                    },{
                        xtype:'button',
                        text:'-',
                        flex:1,
                        handler:function(){
                            stepStore.remove(grid.getSelectionModel().getSelection());
                        }
                    }]
                },{
                    dock:'top',
                    xtype:'toolbar',
                    items:[{
                        xtype:'button',
                        text:'Upload to display',
                        flex:1,
                        handler:function(){
                            var steps = [];
                            stepStore.each(function(step){
                                steps.push({text:step.get('text'), speed:step.get('speed')});
                            });
                            Ext.Ajax.request({
                                url:'/direct',
                                jsonData:steps
                            });
                        }
                     }]
                }],
                listeners:{
                    selectionchange:function(grid, selected){
                        stepEditor.loadStep(selected[0]);
                    }
                }
            });

            this.items = [stepEditor, grid];
            
            this.callParent(arguments);
        },
    });
});
