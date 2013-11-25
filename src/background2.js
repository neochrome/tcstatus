var fsm = require('simple-fsm');

var handleResult = function (result) {
	result = result;
	// choose one
	this.PASSED();  // all passed
	this.FAILED();  // at least one failed
	this.UNKNOWN(); // all paused/unknown
};

var handleError = function (message) {
	message = message;
	this.ERROR();
};

var handleActivate = function () {
	this.UNKNOWN();
};

var handleDeactivate = function () {
	this.INACTIVE();
};

var noop = function () {};

var app = fsm.create({
	INACTIVE: {
		activate  : handleActivate,
		deactivate: noop,
		error     : noop,
		result    : noop
	},
	PASSED: {
		activate  : noop,
		deactivate: handleDeactivate,
		error     : handleError,
		result    : handleResult
	},
	FAILED: {
		activate  : noop,
		deactivate: handleDeactivate,
		error     : handleError,
		result    : handleResult
	},
	UNKNOWN: {
		activate  : noop,
		deactivate: handleDeactivate,
		error     : handleError,
		result    : handleResult
	},
	ERROR: {
		activate  : noop,
		deactivate: handleDeactivate,
		error     : noop,
		result    : handleResult
	}
});
app.INACTIVE();
