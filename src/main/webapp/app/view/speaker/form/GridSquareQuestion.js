Ext.define('ARSnova.view.speaker.form.GridSquareQuestion', {
 extend: 'Ext.Container',



 constructor: function() {
  this.callParent(arguments);


  var gsCanvas = Ext.create('Ext.form.FieldSet', {
   html: "<div align='center'><canvas  width='800' height='600' id='gsCanvas'></canvas></div>",
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
       style: 'margin: auto',
       handler : function(){
    	  //planquadrat.picture.loadPicture('app/images/blaupause.jpg');
    	  planquadrat.picture.loadPicture(Ext.getCmp('imgurl').getValue());
    	  planquadrat.init();
    }},

   ],



  })
 this.add([gsCanvas]);
  //this.added( console.log('addedr listener'));
 //setTimeout(function (){planquadrat.init();}, 10000);


 //planquadrat.init();
 }}
);