var http = require('http').createServer();

var types = {
	buildType: [
		{ id: 1, href: '/1', name: 'build 1' },
		{ id: 2, href: '/2', name: 'build 2' },
		{ id: 3, href: '/3', name: 'build 3' }
	]
};

var builds = {
	'/1/builds': { build: [{ buildTypeId: 1, status: 'SUCCESS' }]},
	'/2/builds': { build: [{ buildTypeId: 2, status: 'FAILURE' }]},
	'/3/builds': { }
};

http.on('request', function(req, res){
	res.writeHead(200, {'Content-Type': 'application/json'});
	console.log(req.url);
	if(req.url === '/httpAuth/app/rest/buildTypes'){
		res.end(JSON.stringify(types));
	} else {
		var parsed = require('url').parse(req.url);
		res.end(JSON.stringify(builds[parsed.pathname]));
	}
});

http.listen(8080);
console.log('listening on port 8080');
