/*--------------------------------------------------------------------------+
 This file is part of ARSnova.
 app/view/FreetextQuestion.js
 - Beschreibung: Template für Freitext-Fragen.
 - Version:      1.0, 22/05/12
 - Autor(en):    Christoph Thelen <christoph.thelen@mni.thm.de>
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
Ext
		.define(
				'ARSnova.view.GridSquareQuestion',
				{
					extend : 'Ext.Panel',

					config : {
						viewOnly : false,
						scrollable : {
							direction : 'vertical',
							directionLock : true
						}
					},

					constructor: function(args) {
						this.callParent(args);
						
						var self = this;
						var questionobj = args.questionObj;
						
						this.questionObj = args.questionObj;
						this.viewOnly = typeof args.viewOnly === "undefined" ? false : args.viewOnly;
						
						var gridSquareID = "gsCanvas-" + Ext.id();
						this.gridSquareID = gridSquareID;

						this.gridsquare = Ext.create('Ext.form.FieldSet', {
							   html: "<div align='center'><canvas width='80%' height='60%' id='"+gridSquareID+"'></canvas></div>",
							   listeners: {
						            painted: function() {
						            	var image = new Image();
								    	
								    	// Get base64
								    	image.src = questionobj.image;
								    	
						            	// Draw grid
								    	createGridSquare(gridSquareID, gridSquareID, parseInt((Fensterweite() * 80) / 100), parseInt((Fensterhoehe() * 60) / 100), questionobj.gridsize, questionobj.gridsize, 100);
								    	getGridSquare(gridSquareID).loadImage(image.src);
						            }
						        }
						});
						
						this.questionTitle = Ext.create('Ext.Component', {
							cls: 'roundedBox',
							html:
								'<p class="title">' + Ext.util.Format.htmlEncode(this.questionObj.subject) + '<p/>' +
								'<p>' + Ext.util.Format.htmlEncode(this.questionObj.text) + '</p>'
						});
						
						this.add([Ext.create('Ext.Panel', {
							items: [this.questionTitle, this.viewOnly ? {} : {
									xtype: 'formpanel',
									scrollable: null,
									submitOnAction: false,
									items: [{
										xtype: 'fieldset',
										items: [this.gridsquare]
									}, {
										xtype: 'container',
										layout: {
											type: 'hbox',
											align: 'stretch'
										},
										defaults: {
											style: {
												margin: '10px'
											}
										},
										items: [{
											flex: 1,
											xtype	: 'button',
											ui: 'confirm',
											cls: 'login-button noMargin',
											text: Messages.SAVE,
											handler: this.saveHandler,
											scope: this
										}, !!!this.questionObj.abstention ? { hidden: true } : {
											flex: 1,
											xtype: 'button',
											cls: 'login-button noMargin',
											text: Messages.ABSTENTION,
											handler: this.abstentionHandler,
											scope: this
										}]
									}]
								}
							]
						})]);
						
						this.on('activate', function(){
							/*
							 * Bugfix, because panel is normally disabled (isDisabled == true),
							 * but is not rendered as 'disabled'
							 */
							if(this.isDisabled()) this.disableQuestion();	
						});
						
					},
				
					saveHandler: function(button, event) {
						if (this.isEmptyAnswer()) {
							Ext.Msg.alert(Messages.NOTIFICATION, Messages.MISSING_INPUT);
							return;
						}
						
						Ext.Msg.confirm('', Messages.SUBMIT_ANSWER, function (button) {
							if (button === "yes") {
								this.storeAnswer();
							}
						}, this);
					},
					
					abstentionHandler: function(button, event) {
						Ext.Msg.confirm('', Messages.SUBMIT_ANSWER, function (button) {
							if (button === "yes") {
								this.storeAbstention();
							}
						}, this);
					},
					
					selectAbstentionAnswer: function() {},
					
					isEmptyAnswer: function() {
						if(getGridSquare(this.gridSquareID).exportGrid() != null){
							return false;
						}
						else{
							return true;
						}
					},
					
					saveAnswer: function(answer) {
						var self = this;
						
						answer.saveAnswer({
							success: function() {
								var questionsArr = Ext.decode(localStorage.getItem('questionIds'));
								if (questionsArr.indexOf(self.questionObj._id) == -1) {
									questionsArr.push(self.questionObj._id);
								}
								localStorage.setItem('questionIds', Ext.encode(questionsArr));

								self.disableQuestion();
								ARSnova.app.mainTabPanel.tabPanel.userQuestionsPanel.showNextUnanswered();
								ARSnova.app.mainTabPanel.tabPanel.userQuestionsPanel.checkIfLastAnswer();
							},
							failure: function(response, opts) {
								console.log('server-side error');
								Ext.Msg.alert(Messages.NOTIFICATION, Messages.ANSWER_CREATION_ERROR);
								Ext.Msg.doComponentLayout();
							}
						});
					},
					
					storeAnswer: function () {
						var self = this;

						ARSnova.app.answerModel.getUserAnswer(this.questionObj._id, {
							empty: function() {
								var answerGridSquareID = Ext.util.Format.htmlEncode(self.questionObj.subject);
								
								var answer = Ext.create('ARSnova.model.Answer', {
									type	 		: "skill_question_answer",
									sessionId		: localStorage.getItem("sessionId"),
									questionId		: self.questionObj._id,
									// Answer
									answerText		: getGridSquare(self.gridSquareID).exportAnswerText(),
									timestamp		: Date.now(),
									user			: localStorage.getItem("login")
								});
								
								self.saveAnswer(answer);
							},
							success: function(response) {
								var theAnswer = Ext.decode(response.responseText); 
								var answer = Ext.create('ARSnova.model.Answer', theAnswer);

								// Anwser
								answer.set('answerText', getGridSquare(self.gridSquareID).exportAnswerText());
								answer.set('timestamp', Date.now());
								answer.set('abstention', false);
								
								self.saveAnswer(answer);
							},
							failure: function(){
								console.log('server-side error');
							}
						});
					},
					
					storeAbstention: function() {
						var self = this;
						
						ARSnova.app.answerModel.getUserAnswer(this.questionObj._id, {
							empty: function() {
								var answer = Ext.create('ARSnova.model.Answer', {
									type	 		: "skill_question_answer",
									sessionId		: localStorage.getItem("sessionId"),
									questionId		: self.questionObj._id,
									timestamp		: Date.now(),
									user			: localStorage.getItem("login"),
									abstention		: true
								});
								
								self.saveAnswer(answer);
							},
							success: function(response) {
								var theAnswer = Ext.decode(response.responseText);
								
								var answer = Ext.create('ARSnova.model.Answer', theAnswer);
								answer.set('timestamp', Date.now());
								answer.set('abstention', true);
								
								self.saveAnswer(answer);
							},
							failure: function(){
								console.log('server-side error');
							}
						});
					},
					
					disableQuestion: function() {		
						this.setDisabled(true);
						this.mask(Ext.create('ARSnova.view.CustomMask'));
					},
					
					doTypeset: function(parent) {
						if (typeof this.questionTitle.element !== "undefined") {
							MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.questionTitle.element.dom]);
						} else {
							// If the element has not been drawn yet, we need to retry later
							Ext.defer(Ext.bind(this.doTypeset, this), 100);
						}
					}
				});
