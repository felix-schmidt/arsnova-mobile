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
					id: 'gridSquareQuestionId',

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
						
						var answerStore = Ext.create('Ext.data.Store', {model: 'ARSnova.model.Answer'});
						answerStore.add(this.questionObj.possibleAnswers);

						this.gridsquare = Ext.create('Ext.form.FieldSet', {
							   html: "<div align='center'><canvas width='80%' height='60%' id='"+gridSquareID+"'></canvas></div>",
							   listeners: {
						            painted: function() {
						            	var image = new Image();
								    	
								    	// Get base64
								    	image.src = questionobj.image;
								    	
								    	
						            	// Draw grid
								    	createGridSquare(gridSquareID, gridSquareID, parseInt((Fensterweite() * 80) / 100), parseInt((Fensterhoehe() * 60) / 100), questionobj.gridsize, questionobj.gridsize, 100, Ext.getCmp('gridSquareQuestionId'));
								    	getGridSquare(gridSquareID).enableSelect();
								    	getGridSquare(gridSquareID).loadImage(image.src);
						            }
						        }
						});
						
						this.answerList = Ext.create('Ext.List', {
							store: answerStore,
							
							cls: 'roundedBox',
							variableHeights: true,	
							scrollable: { disabled: true },
							
							itemTpl: new Ext.XTemplate(
								'{text:htmlEncode}',
								'<tpl if="correct === true && this.isQuestionAnswered(values)">',
									'&nbsp;<span style="padding: 0 0.2em 0 0.2em" class="x-list-item-correct">&#10003; </span>',
								'</tpl>',
								{
									isQuestionAnswered: function(values) {
										return values.questionAnswered === true;
									}
								}
							),
							
							listeners: {
								scope: this,
								selectionchange: function(list, records, eOpts) {
									if (list.getSelectionCount() > 0) {
										this.gsSaveButton.enable();
									} else {
										this.gsSaveButton.disable();
									}
								},
								/**
								 * The following events are used to get the computed height of all list items and 
								 * finally to set this value to the list DataView. In order to ensure correct rendering
								 * it is also necessary to get the properties "padding-top" and "padding-bottom" and 
								 * add them to the height of the list DataView.
								 */
						        painted: function (list, eOpts) {
						        	this.answerList.fireEvent("resizeList", list);
						        },
						        resizeList: function(list) {
						        	var listItemsDom = list.select(".x-list .x-inner .x-inner").elements[0];
						        	
						        	this.answerList.setHeight(
						        		parseInt(window.getComputedStyle(listItemsDom, "").getPropertyValue("height"))	+ 
						        		parseInt(window.getComputedStyle(list.dom, "").getPropertyValue("padding-top"))	+
						        		parseInt(window.getComputedStyle(list.dom, "").getPropertyValue("padding-bottom"))
						        	);
						        }
							},
							mode: this.questionObj.questionType === "gs" ? 'MULTI' : 'SINGLE'
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
						
						this.on('preparestatisticsbutton', function(button) {
							button.scope = this;
							button.setHandler(function() {
								var panel = ARSnova.app.mainTabPanel.tabPanel.userQuestionsPanel || ARSnova.app.mainTabPanel.tabPanel.speakerTabPanel;
								panel.questionStatisticChart = Ext.create('ARSnova.view.speaker.QuestionStatisticChart', {
									question	: self.questionObj,
									lastPanel	: self
								});
								ARSnova.app.mainTabPanel.animateActiveItem(panel.questionStatisticChart, 'slide');
							});
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
					
					saveGsQuestionHandler: function() {
						Ext.Msg.confirm('', Messages.SUBMIT_ANSWER, function(button) {
							if (button !== 'yes') {
								return;
							}
							
							var selectedIndexes = [];
							this.answerList.getSelection().forEach(function(node) {
								selectedIndexes.push(this.answerList.getStore().indexOf(node));
							}, this);
							this.markCorrectAnswers();
							
							var answerValues = [];
							for (var i=0; i < this.answerList.getStore().getCount(); i++) {
								answerValues.push(selectedIndexes.indexOf(i) !== -1 ? "1" : "0");
							}
							
							self.getUserAnswer().then(function(answer) {
								answer.set('answerText', answerValues.join(","));
								saveAnswer(answer);
							});
						}, this);
					},
					
					markCorrectAnswers: function() {
						if (this.questionObj.showAnswer) {
							// Mark all possible answers as 'answered'. This will highlight all correct answers.
							this.answerList.getStore().each(function(item) {
								item.set("questionAnswered", true);
							});
						}
					},
					
					gsAbstentionHandler: function() {
						Ext.Msg.confirm('', Messages.SUBMIT_ANSWER, function(button) {
							if (button !== 'yes') {
								return;
							}
							
							self.getUserAnswer().then(function(answer) {
								answer.set('abstention', true);
								self.answerList.deselectAll();
								saveAnswer(answer);
							});
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
