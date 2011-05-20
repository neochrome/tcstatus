var icon = {
	enabled: function(){
		this._set('icon32.png');
	},
	disabled: function(){
		this._set('disabled32.png');
	},
	_set : function(image){
		chrome.browserAction.setIcon({path:'../images/' + image});
	}
};

var badge = {
	unknown: function(){
		this._text('?');
		this._color([190,190,190,230]);
	},
	success: function(){
		this._text('ok');
		this._color([0,255,0,230]);
	},
	failed: function(count){
		this._text(count.toString());
		this._color([255,0,0,230]);
	},
	clear: function(){
		this._text('');
	},
	test: function(){
		this._text('test');
		this._color([190,190,190,230]);
	},
	_text: function(text){
		chrome.browserAction.setBadgeText({text: text});
	},
	_color: function(color){
		chrome.browserAction.setBadgeBackgroundColor({color: color});
	}
};

var action = {
	options: function(){
		chrome.browserAction.setPopup({popup: ''});
	},
	status: function(){
		chrome.browserAction.setPopup({popup: 'views/status.html'});
	}
};
chrome.browserAction.onClicked.addListener(function(tab){
	openTab(chrome.extension.getURL('views/options.html'));
});

var openTab = function(url){
	chrome.tabs.create({url:url});
};

var noUpdate = false;
var test = function(){
	badge.test();
	icon.enabled();
	action.status();
	noUpdate = true;
	builds = [];
	var statuses = ['success','failure','unknown'];
	for(var i = 0; i < 10; i++){
		builds.push({status:statuses[i % 3], name:'a build name'});
	};
};

var builds = [];

var update = function(){
	if(noUpdate){ return; }
	var options = new Options(localStorage);
	var buildsUpdated = [];
	var todo = [];
	var buildTypesUrl = options.getBaseUrl() + '/httpAuth/app/rest/buildTypes';

	$.getJSON(buildTypesUrl)
		.success(function(data){
			if(noUpdate){ return; }
			buildsUpdated = data.buildType.slice();
			buildsUpdated.forEach(function(buildType){ buildType.status = 'unknown'; });
			todo = data.buildType.slice();

			icon.enabled();
			action.status();

			updateStatuses();
		})
	.error(function(){
		if(noUpdate){ return; }
		console.error('failed to retrieve build types from: ' + buildTypesUrl);
	
		icon.disabled();
		badge.unknown();
		action.options();

		setTimeout(update, options.retryInterval);
	});

	var updateStatuses = function(){
		if(noUpdate){ return; }
		if(todo.length === 0) {
			updateCompleted();
			return;
		}
		var buildTypeToCheck = todo.shift();
		var buildsUrl = options.getBaseUrl() + buildTypeToCheck.href + '/builds?count=1';

		$.getJSON(buildsUrl)
		  .success(function(data){
				if(noUpdate){ return; }
				if(typeof data.build === 'undefined') { return; }
				var build = data.build[0];
				buildsUpdated.forEach(function(buildType){
					if(build.buildTypeId === buildType.id){
						buildType.status = build.status === 'SUCCESS' ? 'success' : 'failure';
					}
				});
			})
		.error(function(){
			console.error('failed to retrieve build status from: ' + buildsUrl);
		})
		.complete(updateStatuses);
	};

	var updateCompleted = function(){
		if(noUpdate){ return; }
		builds = buildsUpdated;
		var failed = 0;
		builds.forEach(function(x){
			if(x.status === 'failure'){ failed++; }
	 	});
		icon.enabled()
		failed > 0 ? badge.failed(failed) : badge.success();
		
		setTimeout(update, options.refreshInterval);
	};

};

badge.unknown();
update();
