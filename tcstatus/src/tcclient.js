var get = function(){
};
var TCClient = function(){
	this.builds = [];
	this.running = false;
};
var p = exports.TCClient.prototype = new EventEmitter();

p.start = function(){
	this.running = true;
};

p.stop = function(){
	this.running = false;
};

p.update = function(){
	this._getBuildTypes();
	this._getRunningBuilds();
};

p._getBuildTypes = function(){
	var self = this;
	get('/httpAuth/app/rest/buildTypes')
	.on('data', function(data){
		self._buildTypes = data.buildType;
		self._buildTypesMap = {};
		_(self._buildTypes).each(function(buildType){
			self._buildTypesMap[buildType.id] = buildType;
			self._getBuildType(buildType);
		});
	});
};

p._getRunningBuilds = function(){
	var self = this;
	get('/httpAuth/app/rest/builds?locator=running:true')
	.on('data', function(data){
		_(data.build).each(function(build){
			var buildType = self._buildTypesMap[build.buildTypeId];
			if(!buildType){ return; }
			buildType.status = 'building';
			buildType.percentComplete = build.percentComplete;
			buildType.lastBuildNumber = build.buildNumber;
		}
	});
};

p._getBuildType = function(buildType){
	var self = this;
	buildType.status = 'unknown';
	get(buildType.href')
	.on('data', function(data){
		buildType.description = data.description;
		if(data.paused === true){
			buildType.status = 'paused';
		} else {
			self._getLastBuildFor(buildType);
		}
	});
};

p._getLastBuildFor = function(buildType){
	get(data.builds.href + '?count=1')
	.on('data', function(data){
		if(typeof data === 'undefined' || data === null) { return; }
		if(typeof data.build === 'undefined' || data.build === null) { return; }
		if(data.build.length === 0) { return; }
		buildType.status = data.build[0].status === 'SUCCESS' ? 'success' : 'failure';
		buildType.lastBuildNumber = data.build[0].number;
	});
};

//self.builds = _(data.buildType).map(function(buildType){
//	return {
//		id: buildType.id,
//		project: buildType.projectName,
//		name: buildType.name,
//		description: buildType.description,
//		url: buildType.webUrl,
//		status: 'unknown',
//		lastBuildNumber: undefined,
//		buildProgress: 100
//	};
//});

(function($$, $){
	$$.TCClient = function(options){
		this._options = options;
		this._settings = { context: this,	dataType: 'json' };
		this._success = function(){};
		this._failure = function(){};
		this._running = false;
		this._builds = [];
		this._buildsToUpdate = [];
		this._queue;
	};

	$$.TCClient.prototype.start = function(){
		if(this._running) { return ; }
		this._running = true;
		this._options.load();
		this._queue = new $$.Queue({
			context: this,
			dataType: 'json',
			username: this._options.username,
			password: this._options.password
		}).complete($.proxy(function(withErrors){
			if(!withErrors){ this._onSuccess(); }
		}, this));
		this._update();
		return this;
	};

	$$.TCClient.prototype.stop = function(){
		this._running = false;
		return this;
	

	$$.TCClient.prototype._update = function(){
		if(!this._running) { return; }

		this._queue.add(
			this._options.getBaseUrl() + '/httpAuth/app/rest/buildTypes',
			$.proxy(function(data){
				console.log('got build types');
				console.log(data);
				this._builds = data.buildType;
				this._builds.forEach($.proxy(function(buildType){
					buildType.status = 'unknown';
					this._queue.add(
						this._options.getBaseUrl() + buildType.href,
						$.proxy(function(data){
							console.log('got a build type');
							console.log(data);
							buildType.description = data.description;
							if(data.paused === true){
								buildType.status = 'paused';
							} else {
								this._queue.add(
									this._options.getBaseUrl() + data.builds.href + '?count=1',
									$.proxy(function(data){
										console.log('got builds');
										console.log(data);
										if(typeof data === 'undefined' || data === null) { return; }
									 	if(typeof data.build === 'undefined' || data.build === null) { return; }
									 	if(data.build.length === 0) { return; }
										buildType.status = data.build[0].status === 'SUCCESS' ? 'success' : 'failure';
										buildType.lastBuildNumber = data.build[0].number;
									}, this),
									$.proxy(function(){
										console.error('failed reading builds');
										this._onFailure('Failed to retreive build status for: ' + buildType.name);
									}, this)
								);
							}
						}, this),
						$.proxy(function(){
							console.error('failed reading build type');
							this._onFailure('Failed to retrieve build type: ' + buildType.name);
						}, this)
					);
				}, this));
			}, this),
			$.proxy(function(){
				console.error('failed reading build types');
				this._onFailure('Failed to retrieve build types');
			}, this)
		);
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
