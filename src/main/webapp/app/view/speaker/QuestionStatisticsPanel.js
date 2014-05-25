Ext.define('ARSnova.view.speaker.QuestionStatisticsPanel', {
	extend: 'Ext.Panel',

	config: {
		title	: Messages.STATISTIC,
		style	: 'background-color: black',
		iconCls	: 'tabBarIconCanteen',
		layout	: 'fit'
	},

	require: ['ARSnova.view.components.QuestionToolbar'],

	constructor: function() {

	}
});
