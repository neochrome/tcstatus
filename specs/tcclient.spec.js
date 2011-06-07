describe('TeamCity Client', function(){
	var $ = $ || {};
	var $old;

	beforeEach(function(){
		$old = $;
		$ = {};
	});
	afterEach(function(){
		$ = $old;
	});

	it('should do stuff', function(){
		$ = $with(buildType());
		var res;
		$.getJSON('httpAuth/app/rest/buildTypes').success(function(data){ res = data; });

		expect(res.id).toBe(0);
	});
});


var $with = function(){
	var types = arguments.length > 0 && typeof arguments[0] === 'object' && arguments[0].length ? arguments[0] : arguments;
	var typesUrl = 'httpAuth/app/rest/buildTypes';
	var responses = {};
	responses[typesUrl] = types.length === 0 ? { } : { buildType: []};
	
	for(var i = 0; i < type.length; i++){
		var type = types[i];
		type.href = '/' + type.id;
		responses[typesUrl].buildType.push(type);

		switch(type.status){
		case 'SUCCESS':
		case 'FAILURE':
			responses['/' + type.id + '/builds?count=1'] = {
				buildTypeId: type.id,
				status: type.status
			};
			break;
		}
	}
	return {
		responses: responses,
		getJSON: function(url){
			this.url = url; return this;
		},
		success: function(fn){
			fn(responses[this.url]);
			return this;
		},
		error: function(fn){
			return this;
		}
	};
};

var buildType = function(){
	return {
		id: 0,
		name: '',
		status: 'UNKNOWN',
		withId: function(id){ this.id = id; return this; },
		withName: function(name) { this.name = name; return this; },
		asSuccess: function(){ this.status = 'SUCCESS'; return this; },
		asFailure: function(){ this.status = 'FAILURE'; return this; },
		asUnknown: function(){ this.status = 'UNKNOWN'; return this; }
	};
}

/*
(function($){
	$.TCClient = function(options, updated){
		this.updated = updated;
	};
	$.TCClient.prototype.start = function(){
	};
})(this);
*/
