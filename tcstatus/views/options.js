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
		var stored = JSON.parse(storage.options || '{}');
		for(var p in defaults){
			this[p] = typeof stored[p] === 'undefined' ? defaults[p] : stored[p];
		}
	};

	$.Options.prototype.getBaseUrl = function(){
		return (this.useSsl ? 'https' : 'http')	+ '://' + this.username + ':' + this.password + '@' + this.host + ':' + this.port;
	};

	$.Options.prototype.save = function(storage){
		storage.options = JSON.stringify(this);
	};
})(this);
