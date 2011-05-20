(function($){
	if($.Options){ return; }

	var defaults = {
		useSsl: false,
		host: 'localhost',
		port: 8080,
		username: '',
		password: '',
		refreshInterval: 40000,
		retryInterval: 10000
	};

	$.Options = function(storage){
		this.useSsl          = typeof storage.useSsl          === 'undefined' ? defaults.useSsl          : storage.useSsl === '1';
		this.host            = typeof storage.host            === 'undefined' ? defaults.host            : storage.host;
		this.port            = typeof storage.port            === 'undefined' ? defaults.port            : parseInt(storage.port, 10);
		this.username        = typeof storage.username        === 'undefined' ? defaults.username        : storage.username;
		this.password        = typeof storage.password        === 'undefined' ? defaults.password        : storage.password;
		this.refreshInterval = typeof storage.refreshInterval === 'undefined' ? defaults.refreshInterval : parseInt(storage.refreshInterval, 10);
		this.retryInterval   = typeof storage.retryInterval   === 'undefined' ? defaults.retryInterval   : parseInt(storage.retryInterval, 10);
	};

	$.Options.prototype.getBaseUrl = function(){
		return (this.useSsl ? 'https' : 'http')	+ '://' + this.username + ':' + this.password + '@' + this.host + ':' + this.port;
	};

	$.Options.prototype.save = function(storage){
		storage.useSsl          = this.useSsl ? '1': '0';
		storage.host            = this.host;
		storage.port            = this.port;
		storage.username        = this.username;
		storage.password        = this.password;
		storage.refreshInterval = this.refreshInterval;
		storage.retryInterval   = this.retryInterval;
	};
})(this);
