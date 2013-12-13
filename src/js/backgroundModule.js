angular.module('background', ['ng', 'chrome', 'shared'])
.run(['$controller', '$rootScope', 'Options', 'ScheduleService', function ($controller, $rootScope, options, schedule) {
	options
		.load()
		.then(function () { options.active = true; options.interval = 1; })
		.then(schedule.activate)
		.then(function () {
			$controller('BackgroundController', {$scope: $rootScope});
		});
}]);


angular.module('background')
.service('TeamCityStatusService', ['$q', '$http', function ($q, $http) {
	//$http.get('https://johan:MK)@M1WgLk8GbHVP@tc.intelliplan.net/httpAuth/app/rest/cctray/projects.xml');
	//$http.get('https://tc.intelliplan.net/guestAuth/app/rest/cctray/projects.xml');
	
	var map = {
		'activity': {
			'Sleeping'             : 'sleeping',
			'Building'             : 'building',
			'CheckingModifications': 'checking'
		},
		'lastBuildStatus': {
			'Exception': 'failure',
			'Success'  : 'success',
			'Failure'  : 'failure',
			'Unknown'  : 'unknown'
		},
		'webUrl': 'url'
	};
	map = map;
	$http = $http;
	this.get = function () {
		var deferred = $q.defer();
		deferred.resolve([
			{ status: 'success', activity: 'sleeping', label: '1.1',	url: 'https://', name: 'project 1 :: success' },
			{ status: 'failure', activity: 'building', label: '2.2',	url: 'https://', name: 'project 2 :: failure' },
			{ status: 'unknown', activity: 'checking', label: '3.3',	url: 'https://', name: 'project 3 :: unknown' },
			{ status: 'failure', activity: 'sleeping', label: '4.4',	url: 'https://', name: 'project 4 :: failure' },
			{ status: 'success', activity: 'sleeping', label: '5.5',	url: 'https://', name: 'project 5 :: success' }
		]);
		return deferred.promise;
	};
}]);


angular.module('background')
.controller('BackgroundController', ['TeamCityStatusService', 'EventService', 'chrome.EventService', 'Options', 'LastStatus', function (statusService, events, chromeEvents, options, lastStatus) {
	events.on('evt:schedule:next', function () {
		statusService
		.get()
		.then(lastStatus.set)
		.then(function notify () { chromeEvents.emit('evt:status:update'); });
	});

	chromeEvents.on('evt:options:changed', options.load);
}]);


angular.module('background')
.service('ScheduleService', ['$timeout', 'EventService', 'Options', function ($timeout, eventService, options) {
	var schedule = function () {
		$timeout(schedule, options.interval * 1000)
			.then(function () {
				if (options.active) { eventService.emit('evt:schedule:next'); }
			});
	};
	this.activate = schedule;
}]);


// initialization
angular.injector(['background']);
