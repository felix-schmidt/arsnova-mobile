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
Ext.define('ARSnova.view.speaker.ShowcaseQuestionPanel', {
	extend: 'Ext.Carousel',

	requires: [
    'ARSnova.view.Question',
	  'ARSnova.view.StatisticsCarousel'
	],

	config: {
		fullscreen: true,
		title	: Messages.QUESTIONS,
		iconCls	: 'tabBarIconQuestion',

		controller: null,
    numElements: 0,
    navigationView: null,
    questions: []
	},

	constructor: function() {
		this.callParent(arguments);

    this.statisticsCarousel = Ext.create('ARSnova.view.StatisticsCarousel');

    this.on('navigationview', function(nav) {
      this.setNavigationView(nav);
      nav.on('statistics', function() {
        this.statisticsCarousel.setQuestions(this.getQuestions());
        this.statisticsCarousel.setActiveItemIndex(this.getActiveIndex());
        nav.push(this.statisticsCarousel);
      }, this);
    }, this);
		this.onBefore('activate', this.beforeActivate, this);
		this.on('activate', this.onActivate, this);
	},

	beforeActivate: function(){
		this.removeAll();
		this._indicator.show();
	},

	onActivate: function(){
		this.getAllSkillQuestions();
	},

	getAllSkillQuestions: function() {
		var hideIndicator = ARSnova.app.showLoadMask(Messages.LOAD_MASK_SEARCH_QUESTIONS);
    var panel = this;

		this.getController().getQuestions(localStorage.getItem("keyword"), {
			success: function(response) {
				var questions = Ext.decode(response.responseText);
        panel.setQuestions(questions);
        questions.forEach(function(q) {
          panel.addQuestion(q);
        });
				panel.setNumElements(questions.length);

				if (questions.length == 1){
					panel._indicator.hide();
				}

				// bugfix (workaround): after removing all items from carousel the active index
				// is set to -1. To fix that you have manually  set the activeItem on the first
				// question.
				panel.setActiveItem(0);
				hideIndicator();
			},
			failure: function(response) {
				console.log('error');
				hideIndicator();
			}
		});
	},

	addQuestion: function(question) {
    var question;
		if (question.questionType === 'freetext') {
			question = Ext.create('ARSnova.view.FreetextQuestion', {
				questionObj: question,
				viewOnly: true
			});
		} else {
			question = Ext.create('ARSnova.view.Question', {
				questionObj: question,
				viewOnly: true
			});
		}
    this.add(question);
	}
});
