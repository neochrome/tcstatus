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

var toast = function(title, text){
	var notification = webkitNotifications.createNotification('../images/icon128.png', title, text);
	notification.show();
	setTimeout((function(notification){
  	return function() { notification.cancel(); };
 	})(notification), 10000);
};

var test = function(){
	client.stop();
	badge.test();
	icon.enabled();
	builds = [];
	var statuses = ['success','failure','unknown'];
	for(var i = 0; i < 10; i++){
		builds.push({status:statuses[i % 3], name:'a build name'});
	};
};


var builds = [];

var states = fsm({
	POLLING:{
		success: function(updatedBuilds){
			var failed = 0;
			updatedBuilds.forEach(function(x){
				if(x.status === 'failure'){ failed++; }
			});
			icon.enabled()
			failed > 0 ? badge.failed(failed) : badge.success();
			
			var old = {};
			builds.forEach(function(x){ old[x.id] = x; });
			updatedBuilds.forEach(function(x){
				if(x.status === 'failure' && (typeof old[x.id] === 'undefined' || old[x.id].status !== 'failure' )){
					toast('Failing build', x.name);
				}
			});
			builds = updatedBuilds;
			
			this.POLLING();
		},
		failure: function(){
			badge.unknown();
			webkitNotifications.createHTMLNotification('communication.error.html').show();
			
			this.ERROR();
		}
	},
	ERROR:{
		success: function(updatedBuilds){
			this.POLLING();
			this.success(updatedBuilds);
		},
		failure: function(){
			this.ERROR();
		}
	}
});

var options = new Options(localStorage);
var client = new TCClient(options)
.success(function(updatedBuilds){
	states.success(updatedBuilds);
})
.failure(function(message){
	states.failure();
});

icon.disabled();
function reset(){
	badge.unknown();
	client.stop();
	states.POLLING();
	client.start();
}
reset();
