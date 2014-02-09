Ext.define('ARSnova.view.speaker.form.GridSquareQuestion', {
 extend: 'Ext.Container',

 requires: [
	'Ext.Panel',
	'Ext.Img',
	'Ext.MessageBox',
	'Ext.Button',
	'Ext.ProgressIndicator',
	'Ext.form.Panel',
	'Ext.field.FileInput'
 ],
 
 /* constructor */
 constructor: function() {
  this.callParent(arguments);
  this.imageData = '';
  this.imageDataScaled = '';

  var progressIndicator = Ext.create("Ext.ProgressIndicator");

  var request = {
      //url: '../../../../src/upload-arraybuffer.php',
	  //url: 'http://localhost:8080/src/upload-arraybuffer.php',
	  url: 'http://ellert-webdesign.de/upload-arraybuffer.php',
      method: 'POST',
      responseType: "arraybuffer",
      xhr2: true,
      progress: progressIndicator,
      success: function(response) {
          var createObjectURL = window.URL && window.URL.createObjectURL ? window.URL.createObjectURL : webkitURL && webkitURL.createObjectURL ? webkitURL.createObjectURL : null;
          if (createObjectURL) {
              var image = Ext.Viewport.down("image");
              var blob = new Blob([response.responseBytes], {type: response.getResponseHeader("Content-Type")});
              var url = createObjectURL(blob);
              //image.setSrc(url);
              
              Ext.getCmp('sliderset').setTitle('Rastergröße: ' + Ext.getCmp('slider').getValue().toString() + ' x ' + Ext.getCmp('slider').getValue().toString());
    		  Ext.getCmp('slider').enable();
    		  Ext.getCmp('sliderset2').setTitle('Bildgröße: ' + Ext.getCmp('slider2').getValue().toString() + ' % ');
    		  Ext.getCmp('slider2').enable();
    		  
			  getGridSquare("gsCanvas").setGridSize(Ext.getCmp('slider').getValue(), Ext.getCmp('slider').getValue());
			  getGridSquare("gsCanvas").loadImage(url);
          }
      },
      failure: function(response) {
          var out = Ext.getCmp("output");
          out.setHtml(response.message);
      }
  };
  
  this.add(progressIndicator);
 
  var gsCanvas = Ext.create('Ext.form.FieldSet', {	  
	  html: "<div align='center'><canvas id='gsCanvas'></canvas></div>",
	  
      xtype:"panel",
      layout:"vbox",
      items: [
          {
          	xtype: 'fieldset',
    		title: 'Bild:',
    		//fullscreen: true,
    	    layout: 'hbox',
            items: [
                {
                	xtype: 'panel',
                    flex: 2
                },
                {
                	xtype:"fileinput",
            		accept:"image/jpeg|image/png",	
            		name: 'photo',
            		id: 'imgurl',
            		flex: 2
                },
                {
                	xtype: 'panel',
                    flex: 1
                }
            ]
          },
          {
              xtype:"button",
              text: "Upload Bild",
              ui: 'confirm',
              handler: function(){
                  var input = Ext.Viewport.down("fileinput").input;
                  var image = Ext.Viewport.down("image");
                  var files = input.dom.files;
                  
                  if (files.length) {
                          request.binaryData = files[0];

                          //size is in bytes
                          if(request.binaryData.size <= 2097152) {
                              Ext.Ajax.request(request);
                          } else {
                                  Ext.Msg.alert("JPG Must be less then 2MB");
                          }
                  }else {
                          Ext.Msg.alert("Please Select a JPG");
                  }
              }
          },
          {
              xtype: "panel",
              id: "output",
              scrollable: true,
          },
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
      		         }
      		     }
      		}]
         },
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
     				}
     			}
     		}]
        }
      ]
  });
 this.add([gsCanvas]);
 }, /* constructor End */

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
