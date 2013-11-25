angular.module('chrome', ['ng'])
.service('chrome.MessagingService', function () {
	this.send = function (message) {
		chrome.runtime.sendMessage(message);
	};
	this.on = function (fn) {
		chrome.runtime.onMessage.addListener(function (message) {
			fn(message);
		});
	};
});
