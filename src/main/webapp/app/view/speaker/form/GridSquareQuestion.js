Ext.define('ARSnova.view.speaker.form.GridSquareQuestion', {
 extend: 'Ext.Container',
 xtype: 'gridsquare',

 requires: [
	'Ext.Panel',
	'Ext.Img',
	'Ext.MessageBox',
	'Ext.Button',
	'Ext.ProgressIndicator',
	'Ext.form.Panel',
	'Ext.field.FileInput',
	'Ext.ux.FileUp'
 ],

 /* constructor */
 constructor: function() {

	 this.callParent(arguments);
	 this.imageGs = Ext.create('Ext.form.FieldSet', {
		 id: 'imageGs',
		 html : '<img src="" id="imageGs" style="display:none;">'
	 });

	 this.gsGridCanvas = Ext.create('Ext.form.FieldSet', {
		 id: "gsGridCanvas",
		 hidden: false,
		 html: "<div align='center'><canvas id='gsCanvas'></canvas></div>",
	 });
	 
	 this.fileUpload = Ext.create('Ext.form.FieldSet', {
		 id: 'fileUpload',
		 items: [{
		   itemId: 'fileLoadBtn',
	       xtype: 'fileupload',
	       autoUpload: true,
	       loadAsDataUrl: true,
	       states: {
	           browse: {
	               text: 'Select image'
	           },
	           ready: {
	               text: 'Load'
	           },

	           uploading: {
	               text: 'Loading',
	               loading: true
	           }
	       }
	   }]
	 });
	 
	 this.gsSliderSize = Ext.create('Ext.form.FieldSet', {
		 id: 'gsSliderSize',
		 items: [{
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
      		         }
      		     }
      		}]
         }]
	 });
	 
	 this.gsSliderScale = Ext.create('Ext.form.FieldSet', {
		 id: 'gsSliderScale',
		 items: [{
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
     				}
     			}
     		}]
        }
      ]
  });
	 
 this.add([this.imageGs]);
 this.add([this.fileUpload]);
 this.add([this.gsSliderSize]);
 this.add([this.gsSliderScale]);
 this.add([this.gsGridCanvas]);
 
 }, /* constructor End */
 
 /* For Speaker Edit View */
 initWithQuestion: function(question) {
	 console.log('test');
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

 /* Function to save values to database */
 getQuestionValues: function() {
		var result = {};

		result.possibleAnswers = this.getValues();
		result.image = getGridSquare("gsCanvas").exportPicture();
		result.gridsize = Ext.getCmp('slider').getValue().toString();

		if (!this.hasCorrectOptions()) {
			result.noCorrect = 1;
		}
		
		return result;
 }
});
