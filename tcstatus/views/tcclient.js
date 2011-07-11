(function($$, $){
	$$.TCClient = function(options){
		this._options = options;
		this._settings = { context: this,	dataType: 'json' };
		this._success = function(){};
		this._failure = function(){};
		this._running = false;
		this._builds = [];
		this._buildsToUpdate = [];
	};

	$$.TCClient.prototype.start = function(){
		if(this._running) { return ; }
		this._running = true;
		this._options.load();
		this._update();
		return this;
	};

	$$.TCClient.prototype.stop = function(){
		this._running = false;
		return this;
	};

	$$.TCClient.prototype._settingsFor = function(relativeUrl){
		return $.extend(this._settings, {
			username: this._options.username,
			password: this._options.password, 
			url: this._options.getBaseUrl() + relativeUrl
		});
	};

	$$.TCClient.prototype._update = function(){
		if(!this._running) { return; }

		var buildTypesUrl = this._options.getBaseUrl() + '/httpAuth/app/rest/buildTypes';
		$.ajax(this._settingsFor('/httpAuth/app/rest/buildTypes'))
		.success(function(data){
			if(!this._running) { return; }
			this._builds = data.buildType.slice();
			this._builds.forEach(function(buildType){ buildType.status = 'unknown'; });
			this._buildsToUpdate = data.buildType.slice();
			this._updateBuildStatuses();
		})
	.error(function(){
		console.error('Failed to retrieve build types from: ' + buildTypesUrl);
		if(!this._running) { return; }
		this._onFailure('Failed to retrieve build types');
		this._scheduleUpdate(this._options.retryInterval);
	});
	};

	$$.TCClient.prototype._updateBuildStatuses = function(){
		if(!this._running) { return; }
		if(this._buildsToUpdate.length === 0) {
			this._onSuccess();
			return;
		}
		var buildTypeToCheck = this._buildsToUpdate.shift();
		$.ajax(this._settingsFor(buildTypeToCheck.href))
		.success(function(data){
			if(!this._running) { return; }
			if(data.paused === true){
				this._builds.forEach(function(buildType){
					if(data.id === buildType.id){
						buildType.status = 'paused';
					}
				});
			} else {

				$.ajax(this._settingsFor(data.builds.href + '?count=1'))
				.success(function(data){
					if(!this._running) { return; }
					if(typeof data === 'undefined' || typeof data.build === 'undefined') { return; }
					var build = data.build[0];
					this._builds.forEach(function(buildType){
						if(build.buildTypeId === buildType.id){
							buildType.status = build.status === 'SUCCESS' ? 'success' : 'failure';
							buildType.lastBuildNumber = build.number;
						}
					});
				})
				.error(function(){
					console.error('Failed to retrieve build status from: ' + data.builds.href);
					this._onFailure('Failed to retrieve build status of: ' + buildTypeToCheck.name);
				});
			}
		})
		.error(function(){
			console.error('Failed to retrieve build type from : ' + buildTypeToCheck.href);
			this._onFailure('Failed to retreive information about: ' + buildTypeToCheck.name);
		})
		.complete(this._updateBuildStatuses);
	};

	$$.TCClient.prototype._scheduleUpdate = function(timeout){
		var self = this;
		setTimeout(function(){ self._update(); }, timeout);
	};

	$$.TCClient.prototype._onSuccess = function(){
		if(!this._running){ return; }
		this._success(this._builds);
		this._scheduleUpdate(this._options.refreshInterval);
	};

	$$.TCClient.prototype.success = function(fn){
		this._success = fn;
		return this;
	};

	$$.TCClient.prototype._onFailure = function(message){
		this._failure(message);
	};

	$$.TCClient.prototype.failure = function(fn){
		this._failure = fn;
		return this;
	};

})(this, jQuery);
