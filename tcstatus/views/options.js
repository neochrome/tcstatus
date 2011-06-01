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
		this._storage = storage;
		this.useSsl          = defaults.useSsl;
		this.host            = defaults.host;
		this.port            = defaults.port;
		this.username        = defaults.username;
		this.password        = defaults.password;
		this.refreshInterval = defaults.refreshInterval;
		this.retryInterval   = defaults.retryInterval;
	};

	$.Options.prototype.load = function(){
		this.useSsl          = typeof this._storage.useSsl          === 'undefined' ? defaults.useSsl          : this._storage.useSsl === '1';
		this.host            = typeof this._storage.host            === 'undefined' ? defaults.host            : this._storage.host;
		this.port            = typeof this._storage.port            === 'undefined' ? defaults.port            : parseInt(this._storage.port, 10);
		this.username        = typeof this._storage.username        === 'undefined' ? defaults.username        : this._storage.username;
		this.password        = typeof this._storage.password        === 'undefined' ? defaults.password        : this._storage.password;
		this.refreshInterval = typeof this._storage.refreshInterval === 'undefined' ? defaults.refreshInterval : parseInt(this._storage.refreshInterval, 10);
		this.retryInterval   = typeof this._storage.retryInterval   === 'undefined' ? defaults.retryInterval   : parseInt(this._storage.retryInterval, 10);
	};

	$.Options.prototype.getBaseUrl = function(){
		return (this.useSsl ? 'https' : 'http')	+ '://' + this.host + ':' + this.port;
	};

	$.Options.prototype.save = function(){
		this._storage.useSsl          = this.useSsl ? '1': '0';
		this._storage.host            = this.host;
		this._storage.port            = this.port;
		this._storage.username        = this.username;
		this._storage.password        = this.password;
		this._storage.refreshInterval = this.refreshInterval;
		this._storage.retryInterval   = this.retryInterval;
	};
})(this);
