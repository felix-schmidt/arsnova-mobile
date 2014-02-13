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
 constructor: function(args) {

	 var me = this;

	 this.callParent(arguments);

	 this.canvasId = args.canvasId;


	 this.gsGridCanvas = Ext.create('Ext.form.FieldSet', {
		 id: "field-" + this.canvasId,
		 hidden: false,
		 html: "<br><br><div align='center'><canvas id='" + this.canvasId + "'></canvas></div>",
	 });

	 this.fileUpload = Ext.create('Ext.form.FieldSet', {
		 id: 'fileUpload-' + this.canvasId,
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
	       },
	       listeners : {
	    	   loadsuccess: {
				 fn: function(dataurl, e){

				 	this.gsSliderSize.enable();
				 	this.gsSliderScale.enable();

				  	  if(getGridSquare(this.canvasId) !== null) {
				  		  getGridSquare(this.canvasId).setGridSize(this.gsSliderSize.getValue(), this.gsSliderSize.getValue());
				  		  getGridSquare(this.canvasId).loadImage(dataurl);
				  	  }
				 },
				 scope: me
	    	   },
	    	   loadfailure: function(dataurl, e){
				 console.log('File not loaded!');
	    	   }
	       }
	   }]
	 });

	 this.gsSliderSizeTitle = Ext.create('Ext.Label', {
		 id: 'sliderGridTitle' + this.canvasId,
		 html: "<b>Rastergröße:</b>"
	 });

	 this.gsSliderSize = Ext.create('Ext.field.Slider', {
      			 id: 'sliderGrid' + this.canvasId,
      		     value: 4,
      		     increment: 1,
      		     disabled: true,
      		     minValue: 2,
      		     maxValue: 6,
      		     listeners : {
      		    	 drag: {
      		    		fn: this.updateSliderSize,
      		    		scope: me
      		     },
      				change: {
      		    		fn:  this.updateSliderSize,
      		    		scope: me
         		 },
      		     }
	 });

	 this.gsSliderScaleTitle = Ext.create('Ext.Label', {
     		id: 'sliderScaleTitle' + this.canvasId,
     		html: '<br><br><b>Bildgröße:</b>',
	 });

	 this.gsSliderScale = Ext.create('Ext.field.Slider', {
     			id: 'sliderScale' + this.canvasId,
     			value: 100,
     			increment: 1,
     			disabled: true,
     			minValue: 0,
     			maxValue: 100,

     			listeners : {
     				drag: {
      		    		fn: this.updateSliderScale,
      		    		scope: me
            		},
     				change: {
      		    		fn: this.updateSliderScale,
         				scope: me
                		},
     			}
	 });

 this.add([this.fileUpload]);
 this.add([this.gsSliderSizeTitle]);
 this.add([this.gsSliderSize]);
 this.add([this.gsSliderScaleTitle]);
 this.add([this.gsSliderScale]);
 this.add([this.gsGridCanvas]);

 }, /* constructor End */

 /* For Speaker Edit View */
 initWithQuestion: function(question) {

	 this.gsSliderSize.enable();
	 this.gsSliderScale.enable();
	 this.gsSliderSize.setValue(question.gridsize);
 },

 /* Function to fill Result Object */
 getValues: function() {
	 if(getGridSquare(this.canvasId) !== null) {
   		 return getGridSquare(this.canvasId).exportGrid();
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
		result.image = getGridSquare(this.canvasId).exportPicture();
		result.gridsize = this.gsSliderSize.getValue().toString();

		if (!this.hasCorrectOptions()) {
			result.noCorrect = 1;
		}

		return result;
 },

 updateSliderScale: function(slider, thumb, newVal, oldVal){
		this.gsSliderScaleTitle.setHtml('<br><br><b>Bildgröße:' + slider.getValue() + ' % </b>');

	 	if(getGridSquare(this.canvasId) !== null) {
	 		getGridSquare(this.canvasId).setScale(slider.getValue());
	 	}
},

updateSliderSize: function(slider, thumb, newVal, oldVal){

		 this.gsSliderSizeTitle.setHtml('<b>Rastergröße: '+ slider.getValue() + ' x ' + slider.getValue() +'</b>');

 	 if(getGridSquare(this.canvasId) !== null) {
    		 getGridSquare(this.canvasId).setGridSize(slider.getValue(),slider.getValue());
    	 }
  },
 initForm: function()
 {
	this.gsSliderSize.disable();
	this.gsSliderSize.setValue("4");
	this.gsSliderScale.disable();
	this.gsSliderScale.setValue("100");
	this.gsSliderSizeTitle.setHtml("<b>Rastergröße:</b>");
	this.gsSliderScaleTitle.setHtml("<br><br><b>Bildgröße:</b>");
	getGridSquare(this.canvasId).loadImage("/app/images/default.jpg");
	getGridSquare(this.canvasId).setScale("100");
	getGridSquare(this.canvasId).setGridSize("4","4");
 }
});
