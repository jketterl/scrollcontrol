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

            var stepEditor = Ext.create('Matrix.StepEditor', {
                region:'center',
                dockedItems:[{
                    dock:'bottom',
                    xtype:'toolbar',
                    items:[{
                        xtype:'button',
                        text:'Speichern',
                        handler:function(){
                            me.sequence.save({
                                callback:function(recs, op, success){
                                    if (!success) return;
                                    me.sequence.commit();
                                    me.sequence.steps().commitChanges();
                                }
                            });
                        }
                    }]
                }]
            });

            me.grid = Ext.create('Ext.grid.Panel', {
                region:'west',
                width:200,
                split:true,
                store:this.sequence.steps(),
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
                            me.sequence.steps().add(step);
                            me.grid.getSelectionModel().select(step);
                        }
                    },{
                        xtype:'button',
                        text:'-',
                        flex:1,
                        handler:function(){
                            me.sequence.steps().remove(me.grid.getSelectionModel().getSelection());
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
                            me.sequence.steps().each(function(step){
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

            this.items = [stepEditor, me.grid];
            
            this.callParent(arguments);
        },
        loadSequence:function(sequence){
            this.sequence = sequence;
            this.grid.getView().bindStore(sequence.steps());
        }
    });
});
