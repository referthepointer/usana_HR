Ext.define('Writer.Form', {
    extend: 'Ext.form.Panel',
    alias: 'widget.writerform',

    requires: ['Ext.form.field.Text'],

    initComponent: function(){
        Ext.apply(this, {
            frame: true,
            title: 'New Employee',
            defaultType: 'textfield',
            bodyPadding: 5,
            fieldDefaults: {
                anchor: '100%',
                labelAlign: 'right'
            },
			url: './data/newEmpForm.php',
            items: [{
				fieldLabel: 'First Name',
				//margin: '10 0 0 10',
				name: 'first_name',
				allowBlank: false,
				msgTarget: 'under',
				enforceMaxLength: true,
				maxLength: 255
			},{
				fieldLabel: 'Last Name',
				//margin: '10 0 0 10',
				name: 'last_name',
				allowBlank: false,
				msgTarget: 'under',
				enforceMaxLength: true,
				maxLength: 255
			},{
				fieldLabel: 'Address 1',
				//margin: '10 0 0 10',
				name: 'address_1',
				allowBlank: false,
				msgTarget: 'under',
				enforceMaxLength: true,
				maxLength: 255
			},{
				fieldLabel: 'Address 2',
				//margin: '10 0 0 10',
				name: 'address_2',
				allowBlank: true,
				msgTarget: 'under',
				enforceMaxLength: true,
				maxLength: 255
			},{
				fieldLabel: 'City',
				//margin: '10 0 0 10',
				name: 'city',
				allowBlank: false,
				msgTarget: 'under',
				enforceMaxLength: true,
				maxLength: 50
			},{
				fieldLabel: 'State',
				//margin: '10 0 0 10',
				name: 'state',
				allowBlank: false,
				msgTarget: 'under',
				enforceMaxLength: true,
				maxLength: 50
			},{
				fieldLabel: 'Zip',
				//margin: '10 0 0 10',
				name: 'zip',
				allowBlank: false,
				msgTarget: 'under',
				enforceMaxLength: true,
				maxLength: 20
			},{
				fieldLabel: 'Phone',
				//margin: '10 0 0 10',
				name: 'phone',
				allowBlank: false,
				enforceMaxLength: true,
				maxLength: 20,
				msgTarget: 'under',
				regex: /^\d{0,20}$/,
				regexText: "Must enter numbers only"
			},{
				xtype: 'datefield',
				//margin: '10 0 10 10',
				fieldLabel: 'Start Date',
				name: 'start_date',
				allowBlank: false,
				msgTarget: 'under',
				format: 'm/d/Y', //'08/22/2014'
				invalidText : "{0} is not a valid date - it must be in the format mm/dd/yyyy",
				value: new Date()
			}],
            buttonAlign: 'left',
			buttons: [{
				text: 'Reset',
				handler: function(){
					this.up('form').getForm().reset();
				}
			},{
				text: 'Submit',
				handler: function(){
					var form = this.up('form').getForm();
					if(form.isValid()){
						form.submit({									
							success: function(form, action){										
								Ext.Msg.alert('Success', action.result.msg);
							},
							failure: function(form, action){
								Ext.Msg.alert('Failed', action.result.msg);
							}									
						});
					}							
				}
			}],
			listeners:{
				actioncomplete: function(t,a,o){
					this.getForm().reset();
				}
			}
        });
        this.callParent();
    }
});

Ext.define('Writer.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.writergrid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
    ],

    initComponent: function(){

        this.editing = Ext.create('Ext.grid.plugin.CellEditing',{
			clicksToEdit: 1
		});
		
		var searchBoxData = Ext.create('Ext.data.Store',{
			fields: ['db_col','field'],
			data:[
				{"db_col":'All', "field":'All'},
				{"db_col":'first_name', "field":'First Name'},
				{"db_col":'last_name', "field":'Last Name'},
				{"db_col":'start_date', "field":'Start Date'},
				{"db_col":'employee_id', "field":'Employee ID'}
			]
		});

        Ext.apply(this, {
            plugins: [this.editing],
			tbar:[{
				xtype: 'combobox',
				id: 'searchByBox',
				emptyText: 'All',
				queryMode: 'local',
				width: 110,
				displayField: 'field',
				valueField: 'db_col',
				store: searchBoxData
			},{						
					xtype: 'textfield',
					name: 'searchfield',
					id: 'searchfield',
					emptyText: 'enter search term',
					enableKeyEvents: true,
					listeners:{
						keypress : function(field, e)
						{
							if(e.getKey() == Ext.EventObject.ENTER)
							{
								var searchby = Ext.getCmp('searchByBox').getValue();
								var searchval = Ext.getCmp('searchfield').getValue();
								var myGrid = Ext.getCmp('empGrid');
								myGrid.getStore().clearFilter();
								myGrid.getStore().filter(searchby,searchval);
								myGrid.store.load();
							}
						}
					}
				},{
					text: "Reset",
					handler: function(){
						var myGrid = Ext.getCmp('empGrid');
						Ext.getCmp('searchfield').reset();
						Ext.getCmp('searchByBox').reset();						
						myGrid.getStore().clearFilter();
						myGrid.store.load();
					}
				}],			
            dockedItems: [{
                weight: 1,
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
				buttonAlign: 'left',
                items: [{
                    text: 'Save',
                    scope: this,
                    handler: this.onSync
                }]
            }],
			viewConfig: {
				stripeRows: true,
				emptyText: '<h1 style="margin:20px">No matching results</h1>'
			},
			columns: [{
					text: 'Employee ID', 
					dataIndex: 'employee_id', 
					sortable: true, 
					hideable: true
				},{
					text: 'First Name', 
					dataIndex: 'first_name', 
					sortable: true, 
					hideable: false, 
					field:{
						type:'textfield'
					},
					editor:{
						allowBlank: false,
						maxLength: 255
					}
				},{
					text: 'Last Name', 
					dataIndex: 'last_name', 
					sortable: true, 
					hideable: false, 
					editor:{
						allowBlank: false,
						maxLength: 255
					}
				},{
					text: 'Address 1', 
					dataIndex: 'address_1', 
					sortable: false, 
					hideable: false, 
					editor:{
						allowBlank: false,
						maxLength: 255
					}
				},{
					text: 'Address 2', 
					dataIndex: 'address_2', 
					sortable: false, 
					hideable: true, 
					editor:{
						allowBlank: true,
						maxLength: 255
					}
				},{
					text: 'City', 
					dataIndex: 'city', 
					sortable: true, 
					hideable: false, 
					editor:{
						allowBlank: false,
						maxLength: 50
					}
				},{
					text: 'State',
					dataIndex: 'state', 
					sortable: true, 
					hideable: false, 
					editor:{
						allowBlank: false,
						maxLength: 50
					}
				},{
					text: 'Zip', 
					dataIndex: 'zip', 
					sortable: true, 
					hideable: false, 
					editor:{
						allowBlank: false,
						maxLength: 20								
					}
				},{
					text: 'phone', 
					dataIndex: 'phone', 
					sortable: true, 
					hideable: false, 
					editor:{
						allowBlank: false,								
						regex: /^\d{0,20}$/,
						regexText: "Must enter numbers only",
						maxLength: 20
					}
				},{
					xtype: 'datecolumn',
					text: 'Start Date', 
					dataIndex: 'start_date', 
					sortable: true, 
					hideable: false,
					width: 120,
					/*  The requirements don't ask for this, so it's commented out, but I thought there was value in having it.
					editor:{
						xtype:'datefield',
						format:'m/d/Y',
						allowBlank: false
					}
					*/
				}
			]
        });
        this.callParent();        
    },
    onSync: function(){
        this.store.sync();		
    }    
});


Ext.define('Writer.Person', {
    extend: 'Ext.data.Model',
	idProperty: 'employee_id',
    fields: [
		{name: 'employee_id',type: 'int'},
		{name: 'first_name',	sortType: 'asUCText'},
		{name: 'last_name', 	sortType: 'asUCText'},
		{name: 'address_1',  sortType: 'asUCText'},
		{name: 'address_2', 	sortType: 'asUCText'},
		{name: 'city', 		sortType: 'asUCText'},
		{name: 'state',	 	sortType: 'asUCText'},
		{name: 'zip', 		sortType: 'asUCText'},
		{name: 'phone', 		type: 'string'},
		{name: 'start_date', type: 'date'}
	]   
});

Ext.require([
    'Ext.data.*',
    'Ext.tip.QuickTipManager',
    'Ext.window.MessageBox'	
]);

Ext.onReady(function(){
    Ext.tip.QuickTipManager.init();
    
	function onStoreSizeChange() {
        Ext.getCmp('empGrid').down('#status').update({count: store.getTotalCount()});
    }
	
	var empDataStore = Ext.create('Ext.data.Store',{
		model: 'Writer.Person',
		id: 'empDataStore',
		autoDestroy: true,
		autoLoad: true,
		autoSync: false,
		remoteFilter: true,
		proxy: {
			type: 'ajax',
			api: {
				read: './data/getEmp.php',
				create: './data/getEmp.php',
				update: './data/updEmp.php',
				destroy: './data/getEmp.php'
			},
			reader: {
				type: 'json',
				successProperty: 'success',
				messageProperty: 'msg',
				rootProperty: 'data'
			},
			writer: {
				type: 'json',
				writeAllFields: false,
				rootProperty: 'data'
			}
		},
        listeners: {
            write: function(proxy, operation){
                Ext.toast({
					html:'Saved',
					title:'Success',
					width: 150,
					align:'b',
					closable: false
				
				});
            },
			totalcountchange: onStoreSizeChange
        }
		
	});

    var main = Ext.create('Ext.tab.Panel', {
		renderTo     : Ext.getBody(),
		layout		 : {type: 'vbox', align: 'fit'},
		title        : 'Employee Management',
        renderTo: document.body,
        items: [{
            itemId: 'form',
            xtype: 'writerform',
			layout: {type: 'vbox', align: 'fit'},
            margins: '0 0 10 0',
        }, {
            xtype: 'panel',
			title: 'Update Employee',
			layout: 'fit',
			frame: true,
			items:[{			
				xtype:'writergrid',
				id: 'empGrid',
				autoScroll: true,
				maxHeight: 500,
				flex: 1,					
				title:'Employees',					
				store: empDataStore
			}],
			listeners:{
				activate: function(panel){
					empDataStore.load();
				}
			}
        }]
    });
});