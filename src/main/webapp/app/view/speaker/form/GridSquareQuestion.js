Ext.define('ARSnova.view.speaker.form.GridSquareQuestion', {
 extend: 'Ext.Container',



 constructor: function() {
  this.callParent(arguments);



  var gsCanvas = Ext.create('Ext.form.FieldSet', {
   html: "<div align='center'><canvas width='800' height='600' id='gsCanvas'></canvas></div>",
   items: [
{
	xtype: 'textfield',
	placeHolder: 'Url eingeben!',
	name: 'url',
	id: 'imgurl',


   },
   {
	   xtype : 'button',
       itemId : 'upload',
       text : 'Upload Picture',
       handler : function(){
      	  Ext.getCmp('sliderset').setTitle('Rastergröße: ' + Ext.getCmp('slider').getValue().toString() + ' x ' + Ext.getCmp('slider').getValue().toString());
    	  Ext.getCmp('slider').enable();
    	  planquadrat.raster.columns =Ext.getCmp('slider').getValue() ;
      	  planquadrat.raster.rows = Ext.getCmp('slider').getValue();
    	  planquadrat.picture.loadPicture(Ext.getCmp('imgurl').getValue());
    	  planquadrat.init();
    }},

   {
    	xtype: 'fieldset',
    	id: 'sliderset',
    	title: 'Rastergröße:',
    	items: [{
	 xtype: 'sliderfield',
	 id: 'slider',
     value: 3,
     increment: 1,
     disabled: true,
     minValue: 1,
     maxValue: 6,
     listeners : {
         change: function(slider, thumb, newVal, oldVal){
        	 Ext.getCmp('sliderset').setTitle('Rastergröße: ' + Ext.getCmp('slider').getValue().toString() + ' x ' + Ext.getCmp('slider').getValue().toString());
        	 planquadrat.raster.columns = Ext.getCmp('slider').getValue() ;
        	 planquadrat.raster.rows = Ext.getCmp('slider').getValue();
        	 planquadrat.init();
         }}
   }]}



   ],



  })
 this.add([gsCanvas]);
 }}
);