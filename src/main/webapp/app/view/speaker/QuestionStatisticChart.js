/*--------------------------------------------------------------------------+
 This file is part of ARSnova.
 app/speaker/questionStatisticChart.js
 - Beschreibung: Panel zum Anzeigen der Fragen-Statistik (Balkendiagramm).
 - Version:      1.0, 01/05/12
 - Autor(en):    Christian Thomas Weber <christian.t.weber@gmail.com>
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
Ext.define('ARSnova.view.speaker.QuestionStatisticChart', {
	extend: 'Ext.Container',

  config: {
    fullscreen: true,
    layout: 'vbox'
  },



	questionObj: null,
	questionChart: null,
	questionStore: null,
	lastPanel: null,
	gridStatistic : null,

	renewChartDataTask: {
		name: 'renew the chart data at question statistics charts',
		run: function(){
			ARSnova.app.mainTabPanel._activeItem.getQuestionAnswers(this);
		},
		interval: 10000 //10 seconds
	},

	/**
	 * count every 15 seconds all actually logged-in users for this sessions
	 */
	countActiveUsersTask: {
		name: 'count the actually logged in users',
		run: function(){
			ARSnova.app.mainTabPanel._activeItem.countActiveUsers(this);
		},
		interval: 15000
	},

	constructor: function(args){
		this.callParent(args);

    var me = this;
		this.questionObj = args.question;
		this.lastPanel = args.lastPanel;
    this.backButtonHandler = args.backButtonHandler || Ext.emptyFn;

		this.questionStore = Ext.create('Ext.data.Store', {
			fields: ['text', 'value', 'percent']
		});

		for ( var i = 0; i < this.questionObj.possibleAnswers.length; i++) {
			var pA = this.questionObj.possibleAnswers[i];
			if(pA.data){
				this.questionStore.add({
					text: pA.data.text,
					value: 0
				});
			} else {
				this.questionStore.add({
					text: pA.text,
					value: 0
				});
			}
		}

		var title = Ext.util.Format.htmlEncode(this.questionObj.text);
		if(window.innerWidth < 800 && title.length > (window.innerWidth / 10))
			title = title.substring(0, (window.innerWidth) / 10) + "...";

		/*this.toolbar = Ext.create('ARSnova.view.components.QuestionToolbar', {
      statisticsEnabled: false,
      backButtonHandler: function() {
        var callback = me.backButtonHandler;
        callback(ARSnova.app.mainTabPanel.tabPanel);
        ARSnova.app.mainTabPanel.animateActiveItem(ARSnova.app.mainTabPanel.tabPanel, {
          type		: 'slide',
          direction	: 'right',
          duration	: 700
        });
      }
		});*/

		this.titlebar = Ext.create('Ext.Toolbar', {
			cls		: 'questionStatisticTitle',
			docked	: 'top',
			title	: title,
			border  : '0px',
      flex: 1
		});

		if(this.questionObj.questionType == "grid"){
			this.titlebar.setStyle('background-color: #C5CCD3');
			this.setLayout('');
			this.setScrollable(true);
		}

		this.questionChart = Ext.create('ARSnova.view.components.QuestionStatisticsChart', {
      store: this.questionStore,
      hidden: this.questionObj.questionType === "grid",
      questionObject: this.questionObj,
      flex: 2
    });

		this.add([this.titlebar, this.questionChart]);

		if (this.questionObj.questionType === "grid") {
			this.setStyle('background-color: #C5CCD3');
			// add statistic
			this.gridStatistic = Ext.create('ARSnova.view.components.GridStatistic', {
				questionObj : this.questionObj
			});
			this.add({xtype : 'spacer', height :25, docked : 'top' });
			this.add(this.gridStatistic);
			this.getQuestionAnswers();
		}

		this.on('activate', this.onActivate);
    this.on('deactivate', function() {
      //taskManager.stop(this.renewChartDataTask);
      //taskManager.stop(this.countActiveUsersTask);
    }, this);
	},

	getQuestionAnswers: function() {
    var me = this;
		ARSnova.app.questionModel.countAnswers(localStorage.getItem('keyword'), this.questionObj._id, {
			success: function(response) {
				var chart = me.questionChart;
				var store = chart.getStore();
				var answers = Ext.decode(response.responseText);

				var sum = 0;
				var maxValue = 10;

				var tmp_possibleAnswers = [];
				for ( var i = 0; i < tmp_possibleAnswers.length; i++) {
					var el = tmp_possibleAnswers[i];
					var record = store.findRecord('text', el, 0, false, true, true);
					record.set('value', 0);
				}

				for ( var i = 0; i < me.questionObj.possibleAnswers.length; i++) {
					var el = me.questionObj.possibleAnswers[i];
					if(el.data)
						tmp_possibleAnswers.push(el.data.text);
					else
						tmp_possibleAnswers.push(el.text);
				}

				var mcAnswerCount = [];
				var abstentionCount = 0;
				for ( var i = 0, el; el = answers[i]; i++) {
					if (me.questionObj.questionType === "mc") {
						if (!el.answerText) {
							abstentionCount = el.abstentionCount;
							continue;
						}
						var values = el.answerText.split(",").map(function(answered) {
							return parseInt(answered, 10);
						});
						if (values.length !== me.questionObj.possibleAnswers.length) {
							return;
						}

						for (var j=0; j < el.answerCount; j++) {
							values.forEach(function(selected, index) {
								if (typeof mcAnswerCount[index] === "undefined") {
									mcAnswerCount[index] = 0;
								}
								if (selected === 1) {
									mcAnswerCount[index] += 1;
								}
							});
						}
						store.each(function(record, index) {
							record.set("value", mcAnswerCount[index]);
						});
					} else if (me.questionObj.questionType === "grid") {
						me.gridStatistic.answers 		= answers;
						me.gridStatistic.setQuestionObj  = me.questionObj;
						me.gridStatistic.updateGrid();
					} else {
						if (!el.answerText) {
							abstentionCount = el.abstentionCount;
							continue;
						}
						var record = store.findRecord('text', el.answerText, 0, false, true, true); //exact match
						record.set('value', el.answerCount);
					}
					sum += el.answerCount;

					if (el.answerCount > maxValue) {
						maxValue = Math.ceil(el.answerCount / 10) * 10;
					}

					var idx = tmp_possibleAnswers.indexOf(el.answerText); // Find the index
					if(idx!=-1) tmp_possibleAnswers.splice(idx, 1); // Remove it if really found!
				}
				if (abstentionCount) {
					var record = store.findRecord('text', Messages.ABSTENTION, 0, false, true, true); //exact match
					if (!record) {
						store.add({ text: Messages.ABSTENTION, value: abstentionCount});
					} else if (record.get('value') != abstentionCount) {
						record.set('value', abstentionCount);
					}
				}

				// Calculate percentages
				/*var totalResults = store.sum('value');
				store.each(function(record) {
					var percent = Math.round((record.get('value') / totalResults) * 100);
					record.set('percent', percent);
				});
				chart.getAxes()[0].setMaximum(maxValue);*/

				// renew the chart-data
				chart.redraw();

				//update quote in toolbar
        //me.toolbar.setFirstCounterElement(sum);
			},
			failure: function() {
				console.log('server-side error');
			}
		});
	},

	onActivate: function() {
    this.renewChartDataTask.run = Ext.bind(this.renewChartDataTask.run, this);
    this.countActiveUsersTask.run = Ext.bind(this.countActiveUsersTask.run, this);
		//taskManager.start(this.renewChartDataTask);
		//taskManager.start(this.countActiveUsersTask);
		this.doTypeset();
	},

	doTypeset: function(parent) {
		if (typeof this.titlebar.element !== "undefined") {
			if ("undefined" !== typeof MathJax) {
				MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.titlebar.element.dom]);
			}

			// get the computed height of MathJax and set it as new height for question titlebar
			var mjaxDom		= this.titlebar.element.dom.childNodes[0].childNodes[0].childNodes[0];
			var mjaxHeight	= window.getComputedStyle(mjaxDom, "").getPropertyValue("height");
			this.titlebar.setHeight(mjaxHeight);
		} else {
			// If the element has not been drawn yet, we need to retry later
			Ext.defer(Ext.bind(this.doTypeset, this), 100);
		}
	},

	countActiveUsers: function() {
    var me = this;
		ARSnova.app.loggedInModel.countActiveUsersBySession(localStorage.getItem("keyword"), {
			success: function(response){
				var value = parseInt(response.responseText);
        //me.toolbar.setSecondCounterElement(value);
			},
			failure: function(){
				console.log('server-side error');
			}
		});
	}
});
