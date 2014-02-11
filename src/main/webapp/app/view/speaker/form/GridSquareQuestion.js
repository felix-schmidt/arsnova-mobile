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

	 this.callParent(arguments);

	 this.canvasId = args.canvasId;
	 this.imageGs = Ext.create('Ext.form.FieldSet', {
		 id: 'imageGs',
		 html : '<img src="" id="imageGs" style="display:none;">'
	 });

	 this.gsGridCanvas = Ext.create('Ext.form.FieldSet', {
		 id: "gsGridCanvas",
		 hidden: false,
		 html: "<br><br><div align='center'><canvas id='"+args.canvasId+"'></canvas></div>",
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

	 this.gsSliderSizeTitle = Ext.create('Ext.Label', {
		 id: 'sliderGridTitle',
		 html: "<b>Rastergröße:</b>"
	 });

	 this.gsSliderSize = Ext.create('Ext.field.Slider', {
      			 id: 'sliderGrid',
      		     value: 4,
      		     increment: 1,
      		     disabled: true,
      		     minValue: 2,
      		     maxValue: 6,
      		     listeners : {
      		    	 drag: function(slider, thumb, newVal, oldVal){
      		    		 //console.log(args.canvasId);
      		        	 Ext.getCmp('sliderGridTitle').setHtml('<b>Rastergröße: '+ Ext.getCmp('sliderGrid').getValue().toString() + ' x ' + Ext.getCmp('sliderGrid').getValue().toString() +'</b>');

      		        	 if(getGridSquare(args.canvasId) !== null) {
      			       		 getGridSquare(args.canvasId).setGridSize(Ext.getCmp('sliderGrid').getValue(), Ext.getCmp('sliderGrid').getValue());
      			       	 }
      		         },
      				change: function(slider, thumb, newVal, oldVal){
      		        	 Ext.getCmp('sliderGridTitle').setHtml('<b>Rastergröße: '+ Ext.getCmp('sliderGrid').getValue().toString() + ' x ' + Ext.getCmp('sliderGrid').getValue().toString() +'</b>');

      		        	 if(getGridSquare(args.canvasId) !== null) {
      			       		 getGridSquare(args.canvasId).setGridSize(Ext.getCmp('sliderGrid').getValue(), Ext.getCmp('sliderGrid').getValue());
      			       	 }
      		         },
      		     }
	 });

	 this.gsSliderScaleTitle = Ext.create('Ext.Label', {
     		id: 'sliderScaleTitle',
     		html: '<br><br><b>Bildgröße:</b>',
	 });

	 this.gsSliderScale = Ext.create('Ext.field.Slider', {
     			id: 'sliderScale',
     			value: 100,
     			increment: 1,
     			disabled: true,
     			minValue: 0,
     			maxValue: 100,

     			listeners : {
     				drag: function(slider, thumb, newVal, oldVal){
     				 Ext.getCmp('sliderScaleTitle').setHtml('<br><br><b>Bildgröße:' + Ext.getCmp('sliderScale').getValue().toString() + ' % </b>');

     				 	if(getGridSquare(args.canvasId) !== null) {
     				 		getGridSquare(args.canvasId).setScale(Ext.getCmp('sliderScale').getValue());
     				 	}
     				},
     				change: function(slider, thumb, newVal, oldVal){
        				 Ext.getCmp('sliderScaleTitle').setHtml('<br><br><b>Bildgröße:' + Ext.getCmp('sliderScale').getValue().toString() + ' % </b>');

      				 	if(getGridSquare(args.canvasId) !== null) {
      				 		getGridSquare(args.canvasId).setScale(Ext.getCmp('sliderScale').getValue());
      				 	}
      				}
     			}
	 });

 this.add([this.imageGs]);
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
		result.gridsize = Ext.getCmp('sliderGrid').getValue().toString();

		if (!this.hasCorrectOptions()) {
			result.noCorrect = 1;
		}
//		this.destroy();
		return result;
 }
});
