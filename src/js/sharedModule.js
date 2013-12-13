angular.module('shared', ['ng']);


angular.module('shared')
.service('EventService', ['$rootScope', function ($rootScope) {
	this.emit = function (eventName) {
		if (typeof eventName === 'undefined') { throw 'Missing argument: eventName'; }
		$rootScope.$emit.apply($rootScope, arguments);
	};

	this.on = function (eventName, fn) {
		if (typeof eventName === 'undefined') { throw 'Missing argument: eventName'; }
		if (typeof fn !== 'function') { throw 'Argument error: fn must be a function'; }
		$rootScope.$on(eventName, fn);
	};
}]);


angular.module('shared')
.service('Options', ['$q', function ($q) {
	var defaults = {
		url       : 'http://localhost/',
		user      : 'user',
		pass      : 'pass',
		interval  : 10,
		active    : false,
	};
	var key = 'options';

	this.load = function () {
		var deferred = $q.defer();
		angular.extend(this, defaults, angular.fromJson(localStorage[key] || '{}'));
		deferred.resolve(this);
		return deferred.promise;
	};

	this.save = function () {
		var deferred = $q.defer();
		localStorage[key] = angular.toJson(this);
		deferred.resolve(this);
		return deferred.promise;
	};
}]);



angular.module('shared')
.service('LastStatus', ['$q', function ($q) {
	var key = 'lastStatus';

	this.set = function (status) {
		var deferred = $q.defer();
		localStorage[key] = angular.toJson(status);
		deferred.resolve();
		return deferred.promise;
	};
	
	this.get = function () {
		var deferred = $q.defer();
		deferred.resolve(angular.fromJson(localStorage[key] || '[]'));
		return deferred.promise;
	};
}]);
