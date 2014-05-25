Ext.define("ARSnova.view.NavigationView", {
	extend: "Ext.NavigationView",

	require: ['ARSnova.view.components.QuestionToolbar'],

	config: {
		navigationBar: {
			ui: 'light'
		},

		root: null
	},

	constructor: function() {
		this.callParent(arguments);

		this.questionToolbar = Ext.create('ARSnova.view.components.QuestionToolbar');
		this.getNavigationBar().getBackButton().setText(Messages.BACK);

		// an easy way to get a visible back button
		this.push(this.getRoot());
		// now hook up the visible button, this allows to move back to the old panels
		this.getNavigationBar().getBackButton().on('tap', this.backButtonHandler, this);

		this.on('push', function(self, view) {
			// Allow dynamic change of navigation bar elements
			view.on('activeitemchange', this.updateNavbar, this);
		}, this);

		this.getNavigationBar().add([
			{ xtype: 'spacer' },
			this.questionToolbar.questionCounter,
			this.questionToolbar.statisticsButton
		]);
	},

	// This method connects the NavigationView with the old navigation model.
	// Remove once everything is a NavigationView.
	backButtonHandler: function(button, event) {
		var sTP;
		if (this.getInnerItems().length === 1) {
			sTP = ARSnova.app.mainTabPanel.tabPanel.speakerTabPanel;
			sTP.animateActiveItem(sTP.audienceQuestionPanel, {
				type: 'slide',
				direction: 'right',
				duration: 700
			});
			return false;
		}
		return true;
	},

	updateNavbar: function(panel, newCard, oldCard) {
		var navbar = this.getNavigationBar();
		if (typeof panel.getDynamicToolbar !== "undefined") {
			navbar.setTitle(this.questionToolbar.setQuestionTitle(newCard.questionObj));
			this.questionToolbar.setQuestionCounter(panel.activeIndex+1, panel.getNumElements());
			newCard.fireEvent('preparestatisticsbutton', this.questionToolbar.statisticsButton, panel.activeIndex, this);
		}
	}

});
