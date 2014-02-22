/*--------------------------------------------------------------------------+ 
 This file is part of ARSnova.
 - Autor(en):   Andreas Schnell <andreas.schnell@mni.thm.de>
				Eric Schemm 	<eric.schemm@mni.thm.de>
 +--------------------------------------------------------------------------*/
/**
 * This class is the controller for the conversion-application.
 */
Ext.define('mathjax.controller.MathJaxMarkdownEditor', {
    extend: 'Ext.app.Controller',
    
    config: {
	
        refs: {
            mainView: 'main',
			btnChange: 'main button[action=convert]',
			mathjaxInput: 'main textfield[name=nNormalHTMLCode]',
			mathjaxTextArea: 'main mathjaxtarea[name=mathjaxtext]'
        },
		
        control: {
			'btnChange': {
				tap: 'convert'
			},
			'mainView': {
                activeitemchange: 'onCarouselChange'
            }
        }
    },
	
	/**
	 * This function convert user-text to Markdown and MathJax.
	 */
    convert: function () {
		
		/*
		 * Get the user-text from input-field.
		 */
		var text = this.getMathjaxInput().getValue();
		/*
		 * Avoid escape from newline character in MathJax-Tags.
		 */
		text = text.replace(/\\\\/g,"\\\\\\\\");
		/*
		 * Generate a new Dom-element buffer for, MathJax transformation.
		 */
		var buffer = document.createElement("div");
		/*
		 * Parsing Markdown-Tags.
		 */
		buffer.innerHTML = markdown.toHTML(text);
		/*
		 * Parsing MathJax-Tags.
		 */
		MathJax.Hub.Queue(
			["Typeset",MathJax.Hub, buffer]
		);
		this.getMathjaxTextArea().loadMathjax(buffer);
	}
}
);
