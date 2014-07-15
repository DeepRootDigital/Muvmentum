var app = angular.module('starter');

app.factory('travelInfo', function() {
	return {
		all: function() {
			var infoString = window.localStorage['travelInfo'];
			if (infoString) {
				return angular.fromJson(infoString);
			}
			return [];
		},
		save: function(travels) {
			window.localStorage['travelInfo'] = angular.toJson(travels);
		}
	}
});