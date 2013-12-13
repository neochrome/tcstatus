angular.module('chrome', ['ng'])
.service('chrome.EventService', function () {
	this.emit = function (eventName) {
		if (typeof eventName === 'undefined') { throw 'Missing argument: eventName'; }
		var args = [].splice.call(arguments, 1);
		chrome.runtime.sendMessage({eventName: eventName, args: args});
	};
	this.on = function (eventName, fn) {
		if (typeof eventName === 'undefined') { throw 'Missing argument: eventName'; }
		if (typeof fn !== 'function') { throw 'Argument error: fn must be a function'; }
		chrome.runtime.onMessage.addListener(function (message) {
			if (message.eventName !== eventName) { return; }
			fn.apply(null, message.args);
		});
	};
});
