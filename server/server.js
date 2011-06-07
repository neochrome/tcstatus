var http = require('http').createServer();

var types = {
	buildType: [
		{ id: 1, href: '/1', name: 'build 1', projectName: 'project 1', projectId: 1, webUrl: 'chrome://about' },
		{ id: 2, href: '/2', name: 'build 2', projectName: 'project 2', projectId: 2, webUrl: 'chrome://about' },
		{ id: 3, href: '/3', name: 'build 3', projectName: 'project 2', projectId: 2, webUrl: 'chrome://about' }
	]
};

var builds = {
	'1': { build: [{ id: 12345, number: '1234', buildTypeId: 1, status: 'SUCCESS' }]},
	'2': { build: [{ id: 23456, number: '5678', buildTypeId: 2, status: 'FAILURE' }]},
	'3': { }
};

http.on('request', function(req, res){
	res.writeHead(200, {'Content-Type': 'application/json'});

	if(req.url.match(/^\/(\d)/g)){
		res.end(JSON.stringify(builds[RegExp.$1]));
	} else {
		res.end(JSON.stringify(types));
	}
});

function menu(){
	process.stdout.write('\nmenu:\n');
	process.stdout.write('1-2  - toggle status of builds\n');
	process.stdout.write('exit - exits\n> ');
};

http.listen(8080);
console.log('listening on port 8080');
menu();

process.stdin.resume();
process.stdin.on('data', function(data){
	data = data.slice(0, data.length - 1).toString();
	switch(data){
	case 'exit':
		process.exit(0);
		break;
	default:
		builds[data].build[0].status = builds[data].build[0].status === 'SUCCESS' ? 'FAILURE' : 'SUCCESS';
		menu();
	}
});
