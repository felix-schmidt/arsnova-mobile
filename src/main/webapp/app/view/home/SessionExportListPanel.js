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
Ext.define('ARSnova.view.home.SessionExportListPanel', { 
	extend: 'Ext.Panel',
	requires: ['ARSnova.view.Caption', 'ARSnova.view.home.SessionList'],
	
	config: {
		fullscreen: true,
		scrollable: {
			direction: 'vertical',
			directionLock: true
		},
		error: true
	},
	
	initialize: function () {
		var me = this;
		
		this.callParent(arguments);
		
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
		
		this.msgBox = Ext.create('Ext.MessageBox');
	
		this.exportButton = Ext.create('Ext.Button', {
			text: Messages.EXPORT_BUTTON_LABEL,
			ui: 'confirm',
			handler: function () {
				if(me.getError()){
					Ext.Msg.alert(Messages.NOTIFICATION, Messages.EXPORT_NOTIFICATION);
				} else {
					var hTP = ARSnova.app.mainTabPanel.tabPanel.homeTabPanel;
					
					Ext.apply(me.msgBox, {
						YESNO: [
						        { text: 'Dateisystem', itemId: 'yes', ui: 'action' }, 
						        { text: 'Public Pool', itemId: 'no'}]//, ui: 'action' }]
					});

					me.msgBox.show({
						title: Messages.EXPORT_SELECTED_SESSIONS_TITLE,
						message: Messages.EXPORT_SELECTED_SESSIONS_MSG,
						buttons: me.msgBox.YESNO,
						fn: function(btn) {
						    if (btn === 'yes') {
						    	var exportToFile = Ext.create('ARSnova.view.home.SessionExportToFilePanel', {
						    		exportSessionMap: me.sessionMap,
						    		backbuttonHandler: me
						    	});
						    	hTP.animateActiveItem(exportToFile, 'slide');
						    }  else {
						    	var exportToPublic = Ext.create('ARSnova.view.home.SessionExportToPublicPanel', {
						    		
						    	});
						    	hTP.animateActiveItem(exportToPublic, 'slide');
						    }
						}
					});
				}
			}
		});
		
		
		this.toolbar = Ext.create('Ext.Toolbar', {
			title: Messages.SESSIONS,	
			docked: 'top',
			ui: 'light',
			items: [
			     this.backButton, 
				{xtype:'spacer'},
				this.exportButton 
			]
		});
		
		this.sessionsForm = Ext.create('ARSnova.view.home.SessionList', {
			scrollable: null,
			cls: 'standardForm',
			title: Messages.MY_SESSIONS
		});
		
		this.add([this.toolbar]);
	
				
		this.mainPart = Ext.create('Ext.form.FormPanel', {
			cls: 'newQuestion',
			scrollable: null,

			items: [  
		        this.sessionsForm
	        ]
		});
		
		this.add([
	          this.toolbar,
      		  this.mainPart
	  	]);
		
		// load user sessions before displaying the page
		this.onBefore('painted', function () {
			if (ARSnova.app.userRole == ARSnova.app.USER_ROLE_SPEAKER) {
				me.setError(true);
				this.loadCreatedSessions();
			}
		});
	},
	
	loadCreatedSessions: function () {
		var me = this;

		var hideLoadMask = ARSnova.app.showLoadMask(Messages.LOAD_MASK_SEARCH);
		ARSnova.app.sessionModel.getMySessions({
			success: function (response) {
				var sessions = Ext.decode(response.responseText);
				me.sessionMap = [];
				var panel = me;
			
				panel.sessionsForm.removeAll();
				panel.sessionsForm.show();

				var toggleListener = {
						beforechange: function (slider, thumb, newValue, oldValue) {
							
						},
				        change: function (slider, thumb, newValue, oldValue) {
				        	console.log(ARSnova.app);
				        	// TODO why is 0 toggle checked and 1 toggle unchecked?
				            if (newValue == 0) { // true
				                // Changing from off to on...do something?
				            	console.log('on');
				            	me.setError(false);
				            	var id = slider.id.split('_')[1];
				            	me.sessionMap[id][1] = true;
				            	console.log(me.sessionMap);
				            } else if (newValue == 1) { // false
			            	   // Changing from on to off...do something?
				            	console.log('off');
				            	me.setError(true);
				            	var id = slider.id.split('_')[1];
				            	me.sessionMap[id][1] = false;
				            	console.log(me.sessionMap);
				            }
				        }
				};

				
				var session;
				for (var i = 0, session; session = sessions[i]; i++) {
					
					var sessionChecked = false;
					
					me.sessionMap[i] = [session, sessionChecked];
					
					var shortDateString = "";
					var longDateString  = "";
					if (session.creationTime != 0) {
						var d               = new Date(session.creationTime);
						var shortDateString = " ("+d.getDate()+"."+(parseInt(d.getMonth())+1)+"."+d.getFullYear()+")";
						var longDateString  = " ("+d.getDate()+"."+(parseInt(d.getMonth())+1)+"."+d.getFullYear()+" "+d.getHours()+":"+('0'+d.getMinutes()).slice(-2)+")";
					}
					
					// Minimum width of 321px equals at least landscape view
					var displaytext = window.innerWidth > 481 ? session.name + longDateString : session.shortName + shortDateString;
					
					var sessionToggle = Ext.create('Ext.field.Toggle', {
						id: 'sessionToggle_' + i,
						label: Ext.util.Format.htmlEncode(displaytext),
						cls: 'rightAligned',
						sessionObj: session,
						value: sessionChecked
					});
					
					sessionToggle.setListeners(toggleListener);
					
					panel.sessionsForm.addEntry(sessionToggle);
				}

				console.log(me.sessionMap);
				hideLoadMask();
			},
			empty: Ext.bind(function () {
				hideLoadMask();
				this.sessionsForm.hide();
			}, this),
			unauthenticated: function () {
				hideLoadMask();
				ARSnova.app.getController('Auth').login({
					mode: ARSnova.app.loginMode
				});
			},
			failure: function () {
				hideLoadMask();
				console.log("my sessions request failure");
			}
		}, (window.innerWidth > 481 ? 'name' : 'shortname'));
	},
});