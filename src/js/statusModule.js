angular.module('status', ['ng', 'chrome', 'shared']);

angular.module('status')
.controller('StatusController', ['$scope', 'chrome.EventService', 'LastStatus', function ($scope, events, lastStatus) {
	var refresh = function () {
		lastStatus
		.get()
		.then(function (projects) {
			$scope.projects = projects;
			$scope.updated = new Date();
		});
	};
	events.on('evt:status:update', refresh);
	refresh();
}]);
