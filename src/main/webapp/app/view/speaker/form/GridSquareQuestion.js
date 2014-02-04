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
    	  planquadrat.init("gsCanvas");
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
        	 planquadrat.init("gsCanvas");
         }}
   }]}
   ],

  });
 this.add([gsCanvas]);
 },
 
 /* For Speaker Edit View */
 initWithQuestion: function(question) {
		
 },

 /* Function to fill Result Object */
 getValues: function() {
		var values = [], obj;
		var size = Ext.getCmp('slider').getValue().toString();
		var gridvaluecount = size * size;
		var gridselectedvalues = planquadrat.raster.selectedTiles;
		
		/* Mapping selected fields to array */
		for(var i=0; i < gridvaluecount; i++){
			obj = {
					text: 'Field' + (i+1)
				};
			
			/* Set object to true/false */
			if(true){
				obj.correct = true;
			}else{
				obj.correct = false;
			}
			values.push(obj);
		}

		return values;
 },

 hasCorrectOptions: function() {
		var hasCorrectOptions = false;
		var gridselectedvalues = planquadrat.raster.selectedTiles;
		
		if(gridselectedvalues.length > 0){
			hasCorrectOptions = true;
		}

		return hasCorrectOptions;
 },

 /* Function to save vaules to database */
 getQuestionValues: function() {
		var result = {};

		// Convert Canvas to Base64
  	  	var canvas = document.getElementById("gsCanvas");
  	  	var imageData = canvas.toDataURL();
  	  	
		result.possibleAnswers = this.getValues();
		//result.image = imageData;
		//result.imageScaled = imageData;
		result.gridsize = Ext.getCmp('slider').getValue().toString();

		if (!this.hasCorrectOptions()) {
			result.noCorrect = 1;
		}
		return result;
 }
});
