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
				 console.log('File fail!');
	    	   }
	       }
	   }]
	 });

	 this.gsSliderSizeTitle = Ext.create('Ext.Label', {
		 id: 'sliderGridTitle',
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
      		    	 drag: function(slider, thumb, newVal, oldVal){
      		    		 this.gsSliderSizeTitle.setHtml('<b>Rastergröße: '+ newVal + ' x ' + newVal +'</b>');

      		        	 if(getGridSquare(this.canvasId) !== null) {
      			       		 getGridSquare(this.canvasId).setGridSize(newVal, newVal);
      			       	 }
      		         },
      				change: function(slider, thumb, newVal, oldVal){
     		    		 this.gsSliderSizeTitle.setHtml('<b>Rastergröße: '+ newVal + ' x ' + newVal +'</b>');

     		        	 if(getGridSquare(this.canvasId) !== null) {
     			       		 getGridSquare(this.canvasId).setGridSize(newVal, newVal);
     			       	 }
      		         },
      		     }
	 });

	 this.gsSliderScaleTitle = Ext.create('Ext.Label', {
     		id: 'sliderScaleTitle',
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
     				drag: function(slider, thumb, newVal, oldVal){
     					this.gsSliderScaleTitle.setHtml('<br><br><b>Bildgröße:' + newVal + ' % </b>');

     				 	if(getGridSquare(this.canvasId) !== null) {
     				 		getGridSquare(this.canvasId).setScale(newVal);
     				 	}
     				},
     				change: function(slider, thumb, newVal, oldVal){
     					this.gsSliderScaleTitle.setHtml('<br><br><b>Bildgröße:' + newVal + ' % </b>');

     				 	if(getGridSquare(this.canvasId) !== null) {
     				 		getGridSquare(this.canvasId).setScale(newVal);
     				 	}
      				}
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
     Ext.getCmp('sliderGrid').enable();
     Ext.getCmp('sliderScale').enable();
     Ext.getCmp('sliderGrid').setValue(question.gridsize);
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
//		this.destroy();
		return result;
 }
});
