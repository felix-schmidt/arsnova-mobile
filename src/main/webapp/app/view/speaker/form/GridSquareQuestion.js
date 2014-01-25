Ext.define('ARSnova.view.speaker.form.GridSquareQuestion', {
 extend: 'Ext.Container',

 constructor: function() {
  this.callParent(arguments);

  var gsCanvas = Ext.create('Ext.form.FieldSet', {
   html: "<div align='center'><canvas width='80%' height='60%' id='gsCanvas'></canvas></div>",
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
     value: 4,
     increment: 1,
     disabled: true,
     minValue: 2,
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

  });
 this.add([gsCanvas]);
 },
 
 /* Default functions to save data */
 getValues: function() {
		var values = [], obj;
		
		/* 
		 * Hier müssen alle möglichen Felder, egal ob angeklickt oder geklickt in ein Objekt
		 * gelegt werden und mit obj.correct auf true oder false gelegt werden.
		 */
		
		/* Old code
		for (var i=0; i < this.selectAnswerCount.getValue(); i++) {
			obj = {
				text: this.answerComponents[i].getValue()
			};
			if (this.correctComponents[i].getValue()) {
				obj.correct = true;
			} else {
				obj.correct = false;
			}
			values.push(obj);
		}
		*/
		
		return values;
 },
 
 hasCorrectOptions: function() {
		var hasCorrectOptions = false;
		
		// Behandlung fehlt
		
		return hasCorrectOptions;
 },

 getQuestionValues: function() {
		var result = {};
		
		result.possibleAnswers = this.getValues();
		
		if (!this.hasCorrectOptions()) {
			result.noCorrect = 1;
		}
		return result;
 }
});