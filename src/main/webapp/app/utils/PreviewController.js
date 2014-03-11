/*--------------------------------------------------------------------------+
This file is part of ARSnova.
app/utils/PreviewController.js
- Beschreibung  Verwaltet Formularfelder, zu denen es eine Markdown/MathJax Vorschau geben soll.
- Autor(en):    Christian Jurke <Christian.Jurke@mni.thm.de>
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
/**
* @class ARSnova.utils.PreviewController
* @extends Ext.Base
* 
* @author Christian Jurke <Christian.Jurke@mni.thm.de>
* @docauthor Christian Jurke <Christian.Jurke@mni.thm.de>
* 
* The PreviewController manages form-fields.
* We can register a specific Input-Component (for example a TextArea-Component) via the #registerforPreview() method.
* After entering some Markdown and/or MathJax conform markup, we can use the #showPreviewFields() method
* to show a preview of the markup text.
* 
* Additionally there are special hide and show methods.
* These methods are used with the Input-Component as parameter.
* Depending on the current state of the PreviewController this Input-Component or its coresponding
* preview field is shown/hidden.
*/
Ext.define('ARSnova.utils.PreviewController', {
	extend: 'Ext.Base',
	
	config: {
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.editFields = new Array();
		this.previewFields = new Array();
		this.showPreview = false;
	},
	
	/*
	Register a component for preview.
	If a component is registered for preview, we can use the #showPreviewFields() method
	to hide this component and instead show a panel, which shows a preview of the entered markup text.
	*/
	registerForPreview: function (component) {
		/* Used for form fields, because we need to set the label */
		if (component.isXType('field')) {
			var previewPanel = Ext.create('Ext.field.Field', {
				styleHtmlContent: true,
				label: component.getLabel(),
				listeners: {
					show: function () {
						previewPanel.setHtml(mathJaxConvert(component.getValue()));
					}
				}
			});
		} else {
			var previewPanel = Ext.create('Ext.Panel', {
				styleHtmlContent: true,
				listeners: {
					show: function () {
						previewPanel.setHtml(mathJaxConvert(component.getValue()));
					}
				}
			});
		}
		/*
		Get the id of the registered component and insert a new preview component at the same place.
		One of these components should always be hidden.
		*/
		var i = component.up().items.indexOf(component);
		component.up().insert(i, previewPanel);
		this.editFields.push(component);
		this.previewFields.push(previewPanel);
		
		if (component.isHidden()) {
			/* If the component is not visible at the moment, nothing should be shown */
			component.hide();
			previewPanel.hide();
		} else if (this.showPreview) {
			/* If the registered component is visible, but we should show the preview fields, show the preview field */
			component.hide();
			previewPanel.show();
		} else {
			/* Otherwise keep the registered component as is and hide the preview component */
			previewPanel.hide();
			component.show();
		}
		return previewPanel;
	},
	
	/*
	For all the registered components, show these components and hide their respective preview components.
	*/
	showEditFields: function () {
		this.showPreview = false;
		for (i=0; i<this.editFields.length; ++i) {
			var p = this.previewFields[i];
			var e = this.editFields[i];
			/* If both components are hidden, we should not make one of them visible */
			if (p.isHidden() && e.isHidden()) continue;
			p.hide();
			e.show();
		}
	},
	
	/*
	For all the registered components, hide these components and show their respective preview components instead.
	*/
	showPreviewFields: function () {
		this.showPreview = true;
		for (i=0; i<this.editFields.length; ++i) {
			var p = this.previewFields[i];
			var e = this.editFields[i];
			/* If both components are hidden, we should not make one of them visible */
			if (p.isHidden() && e.isHidden()) continue;
			e.hide();
			p.show();
		}
	},
	
	setHidden: function(component, hide) {
	if (hide) {
			this.hide(component);
		} else {
			this.show(component);
		}
	},
	
	/*
	Hide the given registered component and its preview field.
	*/
	hide: function(component) {
		var i = this.editFields.indexOf(component);
		if (i > -1) {
			this.editFields[i].hide();
			this.previewFields[i].hide();
		}
	},
	
	/*
	Show the registered component OR its preview field, depending on th current state of this PreviewController.
	*/
	show: function(component) {
		var i = this.editFields.indexOf(component);
		if (i > -1) {
			if (this.showPreview) {
				this.editFields[i].hide();
				this.previewFields[i].show();
			} else {
				this.previewFields[i].hide();
				this.editFields[i].show();
			}
		}
	}
});
