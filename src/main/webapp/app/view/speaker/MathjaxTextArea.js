/*--------------------------------------------------------------------------+ 
 This file is part of ARSnova.
 - Autor(en):   Andreas Schnell <andreas.schnell@mni.thm.de>
				Eric Schemm 	<eric.schemm@mni.thm.de>
 +--------------------------------------------------------------------------*/
Ext.define('ARSnova.view.speaker.MathjaxTextArea', {
	extend: 'Ext.field.TextArea',
	xtype: 'mathjaxtarea',
	
	loadMathjax: function(loadpage) {
		this.setStyleHtmlContent(true);
		this.setHtml(loadpage);
	}
});
