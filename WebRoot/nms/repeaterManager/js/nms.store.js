var statusRecord = new Ext.data.Record.create([{
   name : 'paramcode'
}, {
   name : 'paramname'
}, {
   name : 'val1'
}, {
   name : 'rval1'
}, {
   name : 'uptime'
}]);

var statusStore = new Ext.data.Store({
   proxy  : new Ext.data.HttpProxy({
      url : 'repeaterStatus.ered?reqCode=status'
   }),
   reader : new Ext.data.JsonReader({
      totalProperty : 'TOTALCOUNT',
      root          : 'ROOT'
   }, statusRecord)
});

var parameterRecord = new Ext.data.Record.create([{
   name : 'paramcode'
}, {
   name : 'paramname'
}, {
   name : 'val1'
}, {
   name : 'rval1'
}, {
   name : 'uptime'
}]);

var parameterStore = new Ext.data.Store({
   proxy  : new Ext.data.HttpProxy({
      url : 'repeaterStatus.ered?reqCode=status'
   }),
   reader : new Ext.data.JsonReader({
      totalProperty : 'TOTALCOUNT',
      root          : 'ROOT'
   }, parameterRecord)
});

var editRecord = new Ext.data.Record.create([{
   name : 'paramcode'
}, {
   name : 'paramname'
}, {
   name : 'val1'
}, {
   name : 'dataunit'
}, {
   name : 'rval1'
}, {
   name : 'uptime'
}]);

var editStore = new Ext.data.Store({
   proxy  : new Ext.data.HttpProxy({
      url : 'repeaterStatus.ered?reqCode=status'
   }),
   reader : new Ext.data.JsonReader({
      totalProperty : 'TOTALCOUNT',
      root          : 'ROOT'
   }, editRecord)
});

var comboRecord = new Ext.data.Record.create([{
   name : 'paramcode'
}, {
   name : 'paramname'
}, {
   name : 'val1'
}, {
   name : 'rval1'
}, {
   name : 'uptime'
}, {
   name : 'reflagtype'
}]);

var comboStore = new Ext.data.Store({
   proxy  : new Ext.data.HttpProxy({
      url : 'repeaterStatus.ered?reqCode=status'
   }),
   reader : new Ext.data.JsonReader({
      totalProperty : 'TOTALCOUNT',
      root          : 'ROOT'
   }, comboRecord)
});

var store = new Ext.data.Store({
   proxy  : new Ext.data.HttpProxy({
      url : 'repeaterStatus.ered?reqCode=edit'
   }),
   reader : new Ext.data.JsonReader({}, [{
      name : 'value'
   }, {
      name : 'text'
   }])
});

var combo1 = new Ext.form.ComboBox({
   store         : store,
   emptyText     : '请选择',
   valueField    : 'value',
   displayField  : 'text',
   mode          : 'local',
   triggerAction : 'all'
});

 var exitRecord = new Ext.data.Record.create([{
      name : 'paramcode'
   }, {
      name : 'paramname'
   }]);

var exitStore = new Ext.data.Store({
      id     : 'exitStore',
      proxy  : new Ext.data.HttpProxy({
         url : 'repeaterInformation.ered?reqCode=exit'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, exitRecord)
   });

   var noexitStore = new Ext.data.Store({
      id     : 'noexitStore',
      proxy  : new Ext.data.HttpProxy({
         url : 'repeaterInformation.ered?reqCode=noExit'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, exitRecord)
   });