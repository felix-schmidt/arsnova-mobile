Ext.define('ARSnova.view.speaker.form.GridSquareQuestion', {
 extend: 'Ext.Container',

 constructor: function() {
  this.callParent(arguments);
  this.imageData = '';
  this.imageDataScaled = '';

  var gsCanvas = Ext.create('Ext.form.FieldSet', {
   html: "<div align='center'><canvas id='gsCanvas'></canvas></div>",
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
    	  Ext.getCmp('sliderset2').setTitle('Bildgröße: ' + Ext.getCmp('slider2').getValue().toString() + ' % ');
    	  Ext.getCmp('slider2').enable();
    	  
    	  if(getGridSquare("gsCanvas") !== null) {
    		  getGridSquare("gsCanvas").setGridSize(Ext.getCmp('slider').getValue(), Ext.getCmp('slider').getValue());
    		  getGridSquare("gsCanvas").loadImage(Ext.getCmp('imgurl').getValue());
    	  }
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
        	 
        	 
        	 if(getGridSquare("gsCanvas") !== null) {
	       		 getGridSquare("gsCanvas").setGridSize(Ext.getCmp('slider').getValue(), Ext.getCmp('slider').getValue());
	       	 }
         }}
   }]},
   {
   	xtype: 'fieldset',
   	id: 'sliderset2',
   	title: 'Bildgröße:',
   	items: [{
	 xtype: 'sliderfield',
	 id: 'slider2',
    value: 100,
    increment: 1,
    disabled: true,
    minValue: 0,
    maxValue: 100,

    listeners : {
        drag: function(slider, thumb, newVal, oldVal){
       	 Ext.getCmp('sliderset2').setTitle('Bildgröße: ' + Ext.getCmp('slider2').getValue().toString() + ' % ');
       	 
       	 
       	 if(getGridSquare("gsCanvas") !== null) {
	       		 getGridSquare("gsCanvas").setScale(Ext.getCmp('slider2').getValue());
	       	 }
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
	 if(getGridSquare("gsCanvas") !== null) {
   		 return getGridSquare("gsCanvas").exportGrid();
   	 }
	 else {
	 	return null;
	}	
 },

 hasCorrectOptions: function() {
		var hasCorrectOptions = false;
		var gridselectedvalues = this.getValues();

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
		result.image = imageData;
		result.gridsize = Ext.getCmp('slider').getValue().toString();
		
		// Destroy all objects after save
		Ext.getCmp('imgurl').destroy;
		Ext.getCmp('slider').destroy;
		Ext.getCmp('slider2').destroy;
		Ext.getCmp('sliderset').destroy;
		Ext.getCmp('sliderset2').destroy;
		
		if (!this.hasCorrectOptions()) {
			result.noCorrect = 1;
		}
		return result;
 }
});
