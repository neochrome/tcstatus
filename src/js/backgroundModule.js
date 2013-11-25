angular.module('background', ['ng', 'chrome', 'shared'])
.run(['$controller', '$rootScope', function ($controller, $rootScope) {
	$controller('BackgroundController', {$scope: $rootScope});
}]);


angular.module('background')
.service('StatusService', ['$q', '$http', function ($q, $http) {
	//$http.get('https://johan:MK)@M1WgLk8GbHVP@tc.intelliplan.net/httpAuth/app/rest/cctray/projects.xml');
	$http = $http;
	this.get = function () {
		var deferred = $q.defer();
		deferred.resolve([
			{ status: 'success', activity: '', label: '',	name: 'project 1 :: success' },
			{ status: 'failure', activity: '', label: '',	name: 'project 2 :: failure' },
			{ status: 'unknown', activity: '', label: '',	name: 'project 3 :: unknown' },
			{ status: 'failure', activity: '', label: '',	name: 'project 4 :: failure' },
			{ status: 'success', activity: '', label: '',	name: 'project 5 :: success' }
		]);
		return deferred.promise;
	};
}]);


angular.module('background')
.controller('BackgroundController', ['StatusService', 'EventService', function (statusService, eventService) {
	eventService.on('evt:schedule:next', function () {
		statusService
		.get()
		.then(function handleResult (/* status */) {
		})
		.then(function store () {
		})
		.then(function notify () {
			eventService.emit('evt:status:updated');
		});
	});
}]);


angular.module('background')
.service('ScheduleService', ['$timeout', 'EventService', function ($timeout, eventService) {
	var notifyNext = function () {
		eventService.emit('evt:schedule:next');
	};

	var active = false;
	var schedule = function () {
		active = true;
		$timeout(notifyNext, 1000)
			.then(function () {
				if (active) { schedule(); }
			});
	};
	this.activate = schedule;
	this.deactivate = function () { active = false; };
}]);


// initialization
angular.injector(['background']);
