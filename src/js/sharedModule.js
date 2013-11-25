angular
.module('shared', ['ng'])
.service('EventService', ['$rootScope', function ($rootScope) {
	this.on = function (eventName, fn) {
		$rootScope.$on(eventName, fn);
	};
	this.emit = function (eventName, args) {
		$rootScope.$emit(eventName, args);
	};
}]);
