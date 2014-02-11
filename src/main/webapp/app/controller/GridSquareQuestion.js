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

        var image = this.getLoadedImage();
        document.getElementById("imageGs").src = dataurl;
        var img = document.getElementById("imageGs").src;

        Ext.getCmp('sliderGrid').enable();
        Ext.getCmp('sliderScale').enable();

	  	  if(getGridSquare("gsCanvas") !== null) {
	  		  getGridSquare("gsCanvas").setGridSize(Ext.getCmp('sliderGrid').getValue(), Ext.getCmp('sliderGrid').getValue());
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