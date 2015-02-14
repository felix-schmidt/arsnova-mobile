/*
 * This file is part of ARSnova Mobile.
 * Copyright (C) 2011-2012 Christian Thomas Weber
 * Copyright (C) 2012-2015 The ARSnova Team
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
Ext.define('ARSnova.model.Session', {
	extend: 'Ext.data.Model',

	mixin: ['Ext.mixin.Observable'],

	config: {
		proxy: {type: 'restProxy'},
		idProperty: "_id",

		fields: [
			'_rev',
			'type',
			'name',
			'active',
			'shortName',
			'creator',
			'keyword',
			'courseId',
			'courseType',
			'creationTime',
			'learningProgressType',
			'ppAuthorName',
			'ppAuthorMail',
			'ppUniversity',
			'ppLogo',
			'ppSubject',
			'ppLicense',
			'ppDescription',
			'ppFaculty',
			'ppLevel',
			'sessionType'
		],

		validations: [
			{type: 'presence', field: 'type'},
			{type: 'presence', field: 'name', min: 1, max: 50},
			{type: 'length', field: 'shortName', min: 1, max: 12},
			{type: 'presence', field: 'creator'}
		],

		learningProgress: "questions"
	},

	sessionIsActive: true,

	events: {
		sessionActive: "arsnova/session/active"
	},

	constructor: function () {
		this.callParent(arguments);

		ARSnova.app.socket.on(ARSnova.app.socket.events.setSessionActive, function (active) {
			this.sessionIsActive = active;

			this.fireEvent(this.events.sessionActive, active);
		}, this);

		ARSnova.app.socket.on(ARSnova.app.socket.events.learningProgressType, function (progressType) {
			this.setLearningProgress(progressType);
		}, this);
	},

	destroy: function (sessionId, creator, callbacks) {
		return this.getProxy().delSession(sessionId, creator, callbacks);
	},

	create: function (callbacks) {
		return this.getProxy().createSession(this, callbacks);
	},

	checkSessionLogin: function (keyword, callbacks) {
		var me = this;
		return this.getProxy().checkSessionLogin(keyword, {
			success: function (response) {
				var obj = Ext.decode(response.responseText);
				me.setLearningProgress(obj.learningProgressType);
				callbacks.success(obj);
			},
			failure: callbacks.failure
		});
	},

	getMySessions: function (callbacks, sortby) {
		return this.getProxy().getMySessions(callbacks, sortby);
	},

	getPublicPoolSessions: function (callbacks) {
		return this.getProxy().getPublicPoolSessions(callbacks);
	},

	getMyPublicPoolSessions: function (callbacks) {
		return this.getProxy().getMyPublicPoolSessions(callbacks);
	},

	lock: function (sessionKeyword, theLock, callbacks) {
		return this.getProxy().lock(sessionKeyword, theLock, callbacks);
	},

	getMyLearningProgress: function (sessionKeyword, callbacks) {
		var me = this;
		return this.getProxy().getMyLearningProgress(sessionKeyword, this.getLearningProgress(), {
			success: function (progress) {
				var myself = me.progressDescription(progress.myprogress);
				var course = me.progressDescription(progress.courseprogress);
				callbacks.success.call(callbacks.scope, myself, course, progress, me.getLearningProgress());
			}
		});
	},

	getCourseLearningProgress: function (sessionKeyword, callbacks) {
		return this.getCourseLearningProgressByType(sessionKeyword, this.getLearningProgress(), callbacks);
	},

	getCourseLearningProgressByType: function (sessionKeyword, progressType, callbacks) {
		var me = this;
		return this.getProxy().getCourseLearningProgress(sessionKeyword, progressType, {
			success: function (progress) {
				var desc = me.progressDescription(progress);
				callbacks.success.call(callbacks.scope, desc.text, desc.color, progress, progressType);
			},
			failure: callbacks.failure
		});
	},

	progressDescription: function (progress) {
		var color;
		var text = progress + "%";
		if (progress >= 75) {
			color = "green";
		} else if (progress >= 25) {
			color = "orange";
		} else if (progress === 0) {
			color = "";
			text = "…";
		} else {
			color = "red";
		}
		return {
			color: color,
			text: text
		};
	},

	setLearningProgressType: function (sessionKeyword, progressType) {
		ARSnova.app.socket.setLearningProgressType({sessionKeyword: sessionKeyword, learningProgressType: progressType});
		this.setLearningProgress(progressType);
	}
});
