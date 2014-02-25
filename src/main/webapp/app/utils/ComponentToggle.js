

Ext.define('ARSnova.utils.ComponentToggle', {
	extend: 'Ext.Base',
	
	config: {
	},

	constructor: function(config) {
        this.initConfig(config);
        this.editFields = new Array();
        this.previewFields = new Array();
        this.showPreview = false;
    },

    registerForPreview: function (component) {
        var i = component.up().items.indexOf(component);
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
        component.up().insert(i, previewPanel);
        this.editFields.push(component);
        this.previewFields.push(previewPanel);

        if (component.isHidden()) {
            /* If the component is not visible, nothing should be shown */
            component.hide();
            previewPanel.hide();

        } else if (this.showPreview) {
            component.hide();
            previewPanel.show();

        } else {
            previewPanel.hide();
            component.show();
        }

        return previewPanel;
    },

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

    hide: function(component) {
        var i = this.editFields.indexOf(component);
        if (i > -1) {
            this.editFields[i].hide();
            this.previewFields[i].hide();
        }
    },

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
