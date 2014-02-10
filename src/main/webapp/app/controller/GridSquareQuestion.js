Ext.define('ARSnova.controller.GridSquareQuestion', {
    extend: 'Ext.app.Controller',

    requires: [
        'Ext.Img'
    ],

    config: {
        refs: {
            'fileBtn': 'gridsquare #fileBtn',
            'fileLoadBtn': 'gridsquare #fileLoadBtn',
            'loadedImage': 'gridsquare #loadedImage'
        },

        control: {
            fileBtn: {
                success: 'onFileUploadSuccess',
                failure: 'onFileUploadFailure'
            },

            fileLoadBtn: {
                loadsuccess: 'onFileLoadSuccess',
                loadfailure: 'onFileLoadFailure'
            }
        }
    },

    onFileUploadSuccess: function() {
        console.log('Success');
    },

    onFileUploadFailure: function(message) {
        console.log('Failure');
    },

    onFileLoadSuccess: function(dataurl, e) {
        console.log('File loaded');

        var me = this;
        var image = me.getLoadedImage();
       // image.setSrc(dataurl);
        document.getElementById("imageGs").src = dataurl;
        var img = document.getElementById("imageGs").src;
    	Ext.getCmp('sliderset').setTitle('Rastergröße: ' + Ext.getCmp('slider').getValue().toString() + ' x ' + Ext.getCmp('slider').getValue().toString());
    	Ext.getCmp('slider').enable();
  	  	Ext.getCmp('sliderset2').setTitle('Bildgröße: ' + Ext.getCmp('slider2').getValue().toString() + ' % ');
  	  	Ext.getCmp('slider2').enable();

	  	  if(getGridSquare("gsCanvas") !== null) {
	  		  getGridSquare("gsCanvas").setGridSize(Ext.getCmp('slider').getValue(), Ext.getCmp('slider').getValue());
	  		  getGridSquare("gsCanvas").loadImage(img);
	  	  }
    },


    onFileLoadFailure: function(message) {
//        Ext.device.Notification.show({
//            title: 'Loading error',
//            message: message,
//            buttons: Ext.MessageBox.OK,
//            callback: Ext.emptyFn
//        });
    }
});