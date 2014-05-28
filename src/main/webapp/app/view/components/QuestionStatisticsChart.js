Ext.define('ARSnova.view.components.QuestionStatisticsChart', {
	extend: 'Ext.chart.CartesianChart',

	config: {
		questionObject: null,

		style: 'background-color: black',

		animate: {
				easing: 'bounceOut',
				duration: 1000
		},

		axes: [{
				type	: 'numeric',
				position: 'left',
				fields	: ['value'],
				minimum: 0,
				maximum: 10,
				style: { stroke: 'white' },
				label: {
					color: 'white'
				}
		}, {
				type	: 'category',
				position: 'bottom',
				fields	: ['text'],
				style: { stroke: 'white' },
				label: {
					color: 'white',
					rotate: { degrees: 315 }
				}
		}]
	},

	constructor: function() {
		this.callParent(arguments);

		var me = this;
		var question = this.getQuestionObject();

		if (["yesno", "mc", "abcd"].indexOf(question.questionType) !== -1 && !question.noCorrect) {
			if (question.showAnswer) {
				this.gradients = [];
				for (var i = 0; i < question.possibleAnswers.length; i++) {
					var answer = question.possibleAnswers[i];

					if ((answer.data && !answer.data.correct) || (!answer.data && !answer.correct)) {
						this.gradients.push(
							Ext.create('Ext.draw.gradient.Linear', {
								degrees: 90,
								stops: [{ offset: 0,	color: 'rgb(212, 40, 40)' },
												{ offset: 100,	color: 'rgb(117, 14, 14)' }
								]
							})
						);
					} else {
						this.gradients.push(
							Ext.create('Ext.draw.gradient.Linear', {
								degrees: 90,
								stops: [{ offset: 0,	color: 'rgb(43, 221, 115)'  },
												{ offset: 100,	color: 'rgb(14, 117, 56)' }
								]
							})
						);
					}
				}
			} else {
				this.gradients = [
					Ext.create('Ext.draw.gradient.Linear', {
						degrees: 90,
						stops: [{ offset: 0,	color: 'rgb(22, 64, 128)'  },
										{ offset: 100,	color: 'rgb(0, 14, 88)' }
						]
					}),
					Ext.create('Ext.draw.gradient.Linear', {
						degrees: 90,
						stops: [{ offset: 0,	color: 'rgb(48, 128, 128)'  },
										{ offset: 100,	color: 'rgb(8, 88, 88)' }
						]
					}),
					Ext.create('Ext.draw.gradient.Linear', {
						degrees: 90,
						stops: [{ offset: 0,	color: 'rgb(128, 128, 25)'  },
										{ offset: 100,	color: 'rgb(88, 88, 0)' }
						]
					}),
					Ext.create('Ext.draw.gradient.Linear', {
						degrees: 90,
						stops: [{ offset: 0,	color: 'rgb(128, 28, 128)' },
										{ offset: 100,	color: 'rgb(88, 0, 88)' }
						]
					}),
					Ext.create('Ext.draw.gradient.Linear', {
						degrees: 90,
						stops: [{ offset: 0,	color: 'rgb(128, 21, 21)' },
										{ offset: 100,	color: 'rgb(88, 0, 0)' }
						]
					}),
					Ext.create('Ext.draw.gradient.Linear', {
						degrees: 90,
						stops: [{ offset: 0,	color: 'rgb(128, 64, 22)' },
										{ offset: 100,	color: 'rgb(88, 24, 0)' }
						]
					}),
					Ext.create('Ext.draw.gradient.Linear', {
						degrees: 90,
						stops: [{ offset: 0,	color: 'rgb(64, 0, 128)' },
										{ offset: 100,	color: 'rgb(40, 2, 79)' }
						]
					}),
					Ext.create('Ext.draw.gradient.Linear', {
						degrees: 90,
						stops: [{ offset: 0,	color: 'rgb(4, 88, 34)' },
										{ offset: 100,	color: 'rgb(2, 62, 31)' }
						]
					})
				];
			}
		} else {
			this.gradients = [
				Ext.create('Ext.draw.gradient.Linear', {
					degrees: 90,
					stops: [{ offset: 0,	color: 'rgb(22, 64, 128)' },
									{ offset: 100,	color: 'rgb(0, 14, 88)' }
					]
				}),
				Ext.create('Ext.draw.gradient.Linear', {
					degrees: 90,
					stops: [{ offset: 0,	color: 'rgb(48, 128, 128)' },
									{ offset: 100,	color: 'rgb(8, 88, 88)' }
					]
				}),
				Ext.create('Ext.draw.gradient.Linear', {
					degrees: 90,
					stops: [{ offset: 0,	color: 'rgb(128, 128, 25)' },
									{ offset: 100,	color: 'rgb(88, 88, 0)' }
					]
				}),
				Ext.create('Ext.draw.gradient.Linear', {
					degrees: 90,
					stops: [{ offset: 0,	color: 'rgb(128, 28, 128)' },
									{ offset: 100,	color: 'rgb(88, 0, 88)' }
					]
				}),
				Ext.create('Ext.draw.gradient.Linear', {
					degrees: 90,
					stops: [{ offset: 0,	color: 'rgb(128, 21, 21)' },
									{ offset: 100,	color: 'rgb(88, 0, 0)' }
					]
				}),
				Ext.create('Ext.draw.gradient.Linear', {
					degrees: 90,
					stops: [{ offset: 0,	color: 'rgb(128, 64, 22)' },
									{ offset: 100,	color: 'rgb(88, 24, 0)' }
					]
				}),
				Ext.create('Ext.draw.gradient.Linear', {
					degrees: 90,
					stops: [{ offset: 0,	color: 'rgb(64, 0, 128)' },
									{ offset: 100,	color: 'rgb(40, 2, 79)' }
					]
				}),
				Ext.create('Ext.draw.gradient.Linear', {
					degrees: 90,
					stops: [{ offset: 0,	color: 'rgb(4, 88, 34)' },
									{ offset: 100,	color: 'rgb(2, 62, 31)' }
					]
				})
			];
		}

		this.setSeries([{
				type: 'bar',
				xField: 'text',
				yField: 'value',
				style: {
					minGapWidth: 25,
					maxBarWidth: 200
				},
				label: {
					display	: 'insideEnd',
					field	: 'percent',
					color	: '#fff',
					orientation: 'horizontal',
					renderer: function(text) {
						return text + " %";
					}
				},
				renderer: function (sprite, config, rendererData, i) {
					return { fill : me.gradients[i % me.gradients.length] };
				}
		}]);
	},

	setMaximum: function(value) {
		this.getAxes()[0].setMaximum(value);
	}

});
