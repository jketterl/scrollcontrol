Ext.define('Matrix.SequenceWriter', {
    extend:'Ext.data.writer.Json',
    alias:'writer.sequencewriter',
    getRecordData:function(record){
        var x = this.callParent(arguments);
        Ext.apply(x, record.getAssociatedData());
        return x;
    }
});
