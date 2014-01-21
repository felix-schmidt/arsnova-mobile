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
	 xtype : 'slider',
	 renderTo: 'custom-slider',
     value: 3,
     increment: 1,
     minValue: 1,
     maxValue: 6,
     id: 'slider',
     listeners : {
         change: function(slider, thumb, newVal, oldVal){
        	 planquadrat.raster.columns =Ext.getCmp('slider').getValue() ;
        	 planquadrat.raster.rows = Ext.getCmp('slider').getValue();
        	 planquadrat.init();
         }}
   },

   {
	   xtype : 'button',
       itemId : 'upload',
       text : 'Upload Picture',
       handler : function(){

    	  planquadrat.raster.columns =Ext.getCmp('slider').getValue() ;
      	  planquadrat.raster.rows = Ext.getCmp('slider').getValue();
    	  planquadrat.picture.loadPicture(Ext.getCmp('imgurl').getValue());
    	  planquadrat.init();
    }}

   ],



  })
 this.add([gsCanvas]);
  //this.added( console.log('addedr listener'));
 //setTimeout(function (){planquadrat.init();}, 10000);


 //planquadrat.init();
 }}
);