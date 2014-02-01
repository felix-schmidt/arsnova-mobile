Ext.define('ARSnova.view.speaker.form.GridSquareQuestion', {
 extend: 'Ext.Container',

 constructor: function() {
  this.callParent(arguments);
  this.imageData = '';
  this.imageDataScaled = '';

  var gsCanvas = Ext.create('Ext.form.FieldSet', {
   html: "<div align='center'><canvas width='80%' height='60%' id='gsCanvas'></canvas></div>",
   items: [
{
	xtype: 'textfield',
	placeHolder: 'Url eingeben!',
	value: 'app/images/blaupause.jpg',
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
     value: 4,
     increment: 1,
     disabled: true,
     minValue: 2,
     maxValue: 6,

     listeners : {
         drag: function(slider, thumb, newVal, oldVal){
        	 Ext.getCmp('sliderset').setTitle('Rastergröße: ' + Ext.getCmp('slider').getValue().toString() + ' x ' + Ext.getCmp('slider').getValue().toString());
        	 planquadrat.raster.columns = Ext.getCmp('slider').getValue() ;
        	 planquadrat.raster.rows = Ext.getCmp('slider').getValue();
        	 planquadrat.init();
         }}
   }]}
   ],

  });
 this.add([gsCanvas]);
 },

 /* Default functions to save data */
 getValues: function() {
		var values = [], obj;

		return values;
 },

 hasCorrectOptions: function() {
		var hasCorrectOptions = false;

		// Behandlung fehlt

		return hasCorrectOptions;
 },

 getQuestionValues: function() {
		var result = {};

		// Convert Canvas to Base64
  	  	var canvas = document.getElementById("gsCanvas");
  	  	var imageData = canvas.toDataURL();
  	  	
		result.possibleAnswers = this.getValues();
		result.image = imageData;
		result.imageScaled = imageData;

		if (!this.hasCorrectOptions()) {
			result.noCorrect = 1;
		}
		return result;
 }
});