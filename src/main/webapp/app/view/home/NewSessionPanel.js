/*
 * This file is part of ARSnova Mobile.
 * Copyright (C) 2011-2012 Christian Thomas Weber
 * Copyright (C) 2012-2014 The ARSnova Team
 *
 * ARSnova Mobile is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ARSnova Mobile is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ARSnova Mobile.  If not, see <http://www.gnu.org/licenses/>.
 */
Ext.define('ARSnova.view.home.NewSessionPanel', {
	extend: 'Ext.Panel',

	config: {
		fullscreen: true,
		scrollable: null,
		scroll: 'vertical'
	},

	sessionKey: null,

	/* items */
	sessionIdField: null,
	unavailableSessionIds: [],
	mycourses: [],
	mycoursesStore: null,

	/* toolbar items */
	toolbar: null,
	backButton: null,

	constructor: function (args) {
		this.callParent(arguments);

		this.mycoursesStore = new Ext.data.JsonStore({
			model: 'ARSnova.model.Course'
		});
		
		var htmlEncode = window.innerWidth > 321 ? "{fullname:htmlEncode}" : "{shortname:htmlEncode}"; 

		this.mycourses = Ext.create('Ext.List', {
			cls: 'myCoursesList',
			store: this.mycoursesStore,
			disableSelection: true,
			hidden: true,
			style: {
				marginLeft: '12px',
				marginRight: '12px',
				backgroundColor: 'transparent'
			},
			itemTpl: 
				'<div class="x-unsized x-button x-button-normal x-iconalign-left forwardListButton">' +
				'<span class="x-button-icon x-shown courseIcon icon-prof"></span>' +
				'<span class="x-button-label">' + htmlEncode + '</span></div>' 
			,
			listeners: {
				scope: this,

				/**
				 * The following event is used to get the computed height of all list items and
				 * finally to set this value to the list DataView. In order to ensure correct rendering
				 * it is also necessary to get the properties "padding-top" and "padding-bottom" and
				 * add them to the height of the list DataView.
				 */
				resize: function (list, eOpts) {
					var listItemsDom = list.select(".x-list .x-inner .x-inner").elements[0];

					this.mycourses.setHeight(
						parseInt(window.getComputedStyle(listItemsDom, "").getPropertyValue("height")) +
						parseInt(window.getComputedStyle(list.dom, "").getPropertyValue("padding-top")) +
						parseInt(window.getComputedStyle(list.dom, "").getPropertyValue("padding-bottom"))
					);
				}
			}
		});

		this.backButton = Ext.create('Ext.Button', {
			text: Messages.SESSIONS,
			ui: 'back',
			handler: function () {
				var hTP = ARSnova.app.mainTabPanel.tabPanel.homeTabPanel;
				hTP.animateActiveItem(hTP.mySessionsPanel, {
					type: 'slide',
					direction: 'right',
					duration: 700
				});
			}
		});
		
		this.submitButton =  Ext.create('Ext.Button', {
			cls: 'centerButton',
			ui: 'confirm',
			text: Messages.SESSION_SAVE,
			handler: this.onSubmit
		});

		this.toolbar = Ext.create('Ext.Toolbar', {
			title: Messages.NEW_SESSION,
			cls: 'titlePaddingLeft',
			docked: 'top',
			ui: 'light',
			items: [
				this.backButton
			]
		});

		this.add([this.toolbar, {
			title: 'createSession',
			style: {
				marginTop: '15px'
			},
			xtype: 'formpanel',
			scrollable: null,
			id: 'createSession',
			submitOnAction: false,

			items: [{
				xtype: 'fieldset',
				items: [{
					xtype: 'textfield',
					name: 'name',
					label: Messages.SESSION_NAME,
					placeHolder: Messages.SESSION_NAME_PLACEHOLDER,
					maxLength: 50,
					clearIcon: true
				}, {
					xtype: 'textfield',
					name: 'shortName',
					label: Messages.SESSION_SHORT_NAME,
					placeHolder: Messages.SESSION_SHORT_NAME_PLACEHOLDER,
					maxLength: 8,
					clearIcon: true
				}]
			}, this.submitButton, this.mycourses]
		}]);

		this.onBefore('activate', function () {
			this.getMyCourses();
			this.setScrollable(true);
		}, this);
	},
	
	enableInputElements: function() {
		this.submitButton.enable();
		this.mycourses.addListener('itemtap', this.onCourseSubmit);
	},
	
	disableInputElements: function() {
		this.submitButton.disable();
		this.mycourses.removeListener('itemtap', this.onCourseSubmit);
	},

	onSubmit: function (button) {
		var panel = ARSnova.app.mainTabPanel.tabPanel.homeTabPanel.newSessionPanel,
			values = this.up('panel').getValues();
		
		panel.disableInputElements();

		ARSnova.app.getController('Sessions').create({
			name: values.name,
			shortName: values.shortName,
			newSessionPanel: panel,
			creationTime: Date.now()
		});
	},
	
	onCourseSubmit: function (list, index, element, e) {
		var panel = ARSnova.app.mainTabPanel.tabPanel.homeTabPanel.newSessionPanel;
		panel.disableInputElements();
		
		var course = list.getStore().getAt(index);
		
		console.log(course);

		var shortName = course.get('shortname');

		console.log(shortName);

		if (course.get('shortname').length > 12) {
			shortName = course.get('shortname');
			shortName = shortName.substr(0,7);
		}

		ARSnova.app.getController('Sessions').create({
			name: course.get('fullname'),
			shortName: shortName,
			courseId: course.get('id'),
			courseType: course.get('type'),
			newSessionPanel: panel
		});
	},

	getMyCourses: function () {
		this.mycourses.addListener('itemtap', this.onCourseSubmit);
		
		/* only allow auth services with fixed user names */
		var allowedAuthServices = [
			ARSnova.app.LOGIN_LDAP,
			ARSnova.app.LOGIN_CAS
		];
		if (-1 === allowedAuthServices.indexOf(ARSnova.app.loginMode)) {
			return;
		}
		var newSessionPanel = this;
		ARSnova.app.courseModel.getMyCourses({
			success: Ext.bind(function (response) {
				if (response.responseText == "[]") {
					newSessionPanel.mycourses.hide();
					newSessionPanel.setScrollable(null);
				} else {
					newSessionPanel.mycourses.show();
					newSessionPanel.setScrollable(true);
					this.mycoursesStore.removeAll();
					this.mycoursesStore.add(Ext.decode(response.responseText));
					if (window.innerWidth > 321) {
						this.mycoursesStore.sort('fullname');
					} else {
						this.mycoursesStore.sort('shortname');
					}
				}
			}, this),
			empty: Ext.bind(function () {
				newSessionPanel.mycourses.hide();
				newSessionPanel.setScrollable(null);
			}, this),
			unauthenticated: function () {
				ARSnova.app.getController('Auth').login({
					mode: ARSnova.app.loginMode
				});
			},
			failure: function () {
				console.log("my courses request failure");
			}
		}, (window.innerWidth > 321 ? 'name' : 'shortname'));
	}
});
