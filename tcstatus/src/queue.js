(function(exports, $){
	exports.Queue = function(settings){
		this._settings = settings;
		this._requests = [];
		this._onComplete = function(){};
		this._processing = false;
		this._error = false;
	};

	exports.Queue.prototype.add = function(url, success, error){
		this._requests.push({
			url: url,
			success: success,
			error: error
		});
		this._process();
		return this;
	};

	exports.Queue.prototype._process = function(){
		if(this._processing === true) { return; }
		if(this._requests.length === 0){
			var withError = this._error;
			this._error = false;
			this._onComplete(withError);
			return;
		}
		this._processing = true;
		var request = this._requests.shift();
		$.ajax($.extend(this._settings, {url:request.url}))
		.success($.proxy(request.success, this))
		.error($.proxy(function(){ this._error = true; request.error(); }, this))
		.complete($.proxy(function(){ this._processing = false; this._process(); }, this));
	};

	exports.Queue.prototype.complete = function(fn){
		this._onComplete = fn;
		return this;
	};
})(this, jQuery);
