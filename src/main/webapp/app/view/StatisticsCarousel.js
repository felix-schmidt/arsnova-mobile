/*--------------------------------------------------------------------------+
This file is part of ARSnova.
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
Ext.define('ARSnova.view.StatisticsCarousel', {
	extend: 'Ext.Carousel',

	config: {
		activePanelIndex: 0,

		controller: null
	},

	constructor: function() {
		this.callParent(arguments);

		this.onBefore('activate', function() {
			this.removeAll(false);
		}, this);

		this.on('activate', function() {
			this.getAllSkillQuestions();
		}, this);

		this.on('activeitemchange', function(panel, newCard, oldCard) {
			newCard.fireEvent('activate');
			this.loadData(newCard);
			if (oldCard) {
				oldCard.fireEvent('deactivate');
			}
		}, this);
	},

	addStatistics: function(question) {
		var me = this;
		var statisticsPanel;
		var handler = function(panel) {
			// When leaving the statistics view, make sure we end up on the same question that the stats had shown.
			var tabpanel = panel.getActiveItem();
			if (tabpanel.showcaseQuestionPanel) {
				tabpanel.showcaseQuestionPanel.setActiveItem(me.getActiveIndex());
			}
		};

		if (question.questionType !== 'freetext') {
			statisticsPanel = Ext.create('ARSnova.view.speaker.QuestionStatisticChart', {
				question: question,
				lastPanel: this,
				backButtonHandler: handler
			});
		} else {
			statisticsPanel = Ext.create('ARSnova.view.FreetextAnswerPanel', {
				question: question,
				lastPanel: this,
				backButtonHandler: handler
			});
		}
		this.add(statisticsPanel);
	},

	getQuestionAnswers: function(statisticsPanel) {
		statisticsPanel.getQuestionAnswers();
	},

	countActiveUsers: function(statisticsPanel) {
		statisticsPanel.countActiveUsers();
	},

	loadData: function(panel) {
		if (panel.getQuestionAnswers) {
			panel.getQuestionAnswers();
			panel.countActiveUsers();
		} else if (panel.checkFreetextAnswers) {
			panel.checkFreetextAnswers();
		}
	},

	getAllSkillQuestions: function() {
		var me = this;
		this.getController().getQuestions(localStorage.getItem("keyword"), {
			success: function(response) {
				var questions = Ext.decode(response.responseText);
				questions.forEach(function(q) {
					me.addStatistics(q);
				});
				me.setActiveItem(me.getActivePanelIndex());
			}
		});
	}
});
