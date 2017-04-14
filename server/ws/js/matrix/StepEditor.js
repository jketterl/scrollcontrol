Ext.define('Matrix.StepEditor', {
    extend:'Ext.form.Panel',
    frame:true,
    initComponent:function(){
        var me = this;

        var typeStore = Ext.create('Ext.data.Store', {
            fields:['id', 'name'],
            data:[
                {id:'SCROLL_IN', name:'reinscrollen'},
                {id:'SCROLL_OUT', name:'rausscrollen'},
                {id:'HOLD', name:'halten'}
            ]
        });

        var directionStore = Ext.create('Ext.data.Store', {
            fields:['id', 'name'],
            data:[
                {id:'LEFT', name:'links'},
                {id:'RIGHT', name:'rechts'},
                {id:'TOP', name:'oben'},
                {id:'BOTTOM', name:'unten'}
            ]
        });

        me.items = [{
            xtype:'textfield',
            name:'text',
            fieldLabel:'Scroll text'
        }]

        me.grid = Ext.create('Ext.grid.Panel', {
            title:'Animationen',
            height:300,
            columns:[{
                header:'Typ',
                dataIndex:'type',
                width:200,
                editor:{
                    xtype:'combobox',
                    queryMode:'local',
                    store:typeStore,
                    displayField:'name',
                    valueField:'id'
                },
                renderer:function(v){
                    var t = typeStore.getById(v);
                    if (t) return t.get('name');
                    return v;
                }
            },{
                header:'Richtung',
                dataIndex:'direction',
                width:200,
                editor:{
                    xtype:'combobox',
                    queryMode:'local',
                    store:directionStore,
                    displayField:'name',
                    valueField:'id'
                },
                renderer:function(v){
                    var d = directionStore.getById(v);
                    if (d) return d.get('name');
                    return v;
                }
            },{
                header:'Geschwindigkeit',
                dataIndex:'speed',
                width:200,
                editor:{
                    xtype:'slider',
                    maxValue:255
                }
            }],
            store:[],
            plugins:[
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit:1
                })
            ],
            dockedItems:[{
                dock:'bottom',
                xtype:'toolbar',
                items:[{
                    xtype:'button',
                    icon:'img/icons/add.png',
                    tooltip:'Animation hinzufügen',
                    handler:function(){
                        me.step.animations().add(Ext.create('Matrix.Animation'));
                    }
                },{
                    xtype:'button',
                    icon:'img/icons/delete.png',
                    tooltip:'Animation entfernen',
                    handler:function(){
                        var record = me.grid.getSelectionModel().getSelection()[0];
                        me.step.animations().remove(record);
                    }
                }]
            }]
        });

        me.items.push(me.grid);

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
        this.grid.getView().bindStore(step.animations());
    }
});

