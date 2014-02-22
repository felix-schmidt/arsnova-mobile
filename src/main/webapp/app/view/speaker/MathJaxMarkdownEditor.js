/*--------------------------------------------------------------------------+
 This file is part of ARSnova.
 app/speaker/tabPanel.js
 - Beschreibung: Texteditor für Session-Inhaber.
 - Version:      1.0, 31/01/15
 - Autor(en):    Ilyas Yildiz 
   				 Andreas Schnell <andreas.schnell@mni.thm.de>
        		 Eric Schemm 	<eric.schemm@mni.thm.de>
 +---------------------------------------------------------------------------+
 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 as published by the Free Software Foundation; either version 2
 of the License, or any later version.
 +---------------------------------------------------------------------------+
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 You should have received a copy of the GNU General Public License
 along with this program; if not, write to the Free Software
 Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 +--------------------------------------------------------------------------*/
Ext.define('ARSnova.view.speaker.MathJaxMarkdownEditor', {
	extend: 'Ext.tab.Panel',
	xtype: 'editor',
	
	 requires: [
	    		'view.speaker.MathjaxTextArea'
	        ],
	        
	config: {
	    ui: 'light',
	    height: 300,
	    activeTab: 1,	   
	   
	    defaults: {
	        styleHtmlContent: true,
	        scrollable: null,
	    },
	    
		tabBar: {
			layout: {
				pack: 'center'
			}
		},
	    items: [{
		       title: 'Texteditor',
		       itemId: 'editorId',		        
		    },{
		        title: 'Preview',
		        itemId: 'previewId',
//                maxRows: 10,
//                name: 'nNormalHTMLCode',
//				getContent: function(text) {
//					return this.getHtml();
//				}
		    },{
		        title: 'HowTo',
		        itemId: 'howtoId',
		        html: 'Howto Screen'
		    }],
		    listeners: {
		    	//Dieser Ereignishandler wird aktiviert, sobald auf die "Preview" Seite gegangen wird
		    	
		    	//Es wurde keine extra Controller eingeführt, damit die Integration einfacher erfolgen kann.
		    	//Außerden ist der Code somit kompakter
                activeitemchange: function (tabPanel, tab, oldTab) {
                    if(tab.config.title=="Preview"){
                    	/*
                		 * Get the user-text from input-field.
                		 */
                    	var text = markdown.toHTML(this.textarea.getValue());
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
                		
                		markdown.toHTML(text);
                		buffer.innerHTML = text;
                		/*
                		 * Parsing MathJax-Tags.
                		 */
                		MathJax.Hub.Queue(
                			["Typeset",MathJax.Hub, buffer]
                		);
                		this.previewTextarea.loadMathjax(buffer);
                    }
                }
            }, 
	},
	initialize: function(config) {
		this.callParent(arguments);
		this.textarea = Ext.create('Ext.plugins.ResizableTextArea', {
		name: 'textarea',
    	placeHolder	: Messages.QUESTIONTEXT_PlACEHOLDER,
    	maxHeight	: 140
		});
		this.previewTextarea= Ext.create('ARSnova.view.speaker.MathjaxTextArea');
		
		this.getComponent('editorId').add([this.textarea]);
		this.getComponent('previewId').add([this.previewTextarea]);
	},
	
	//Liefert den eingegebenen Text zurück. Dies ist nötig, weil die Eingabefelder vor der Speicherung 
	//validiert werden
	getText: function(){
		return this.previewTextarea.getValue();
	}
	
});