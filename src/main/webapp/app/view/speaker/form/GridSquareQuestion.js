Ext.define('ARSnova.view.speaker.form.GridSquareQuestion', {
	extend: 'Ext.Container',

	constructor: function() {
		this.callParent(arguments);

		var canvas = Ext.create('Ext.form.FieldSet', {
			html: "<canvas widht='800' height='600' id='theCanvas'></canvas>",
		});

	this.add([canvas]);
	}
});
