var http = require('http').createServer();

var buildTypes = [
	{ id: 'bt1', href: '/id:bt1', name: 'build 1', description:'description 1', paused: false, webUrl: 'chrome://about', builds: { href: '/id:bt1/builds' }, project: { name: 'project 1', id: 1} },
	{ id: 'bt2', href: '/id:bt2', name: 'build 2', description:'description 2', paused: false, webUrl: 'chrome://about', builds: { href: '/id:bt2/builds' }, project: { name: 'project 1', id: 2} },
	{ id: 'bt3', href: '/id:bt3', name: 'build 3', description:'description 3', paused: false, webUrl: 'chrome://about', builds: { href: '/id:bt3/builds' }, project: { name: 'project 2', id: 3} },
	{ id: 'bt4', href: '/id:bt4', name: 'build 4', description:'description 4', paused: true, webUrl: 'chrome://about', builds: { href: '/id:bt4/builds' }, project: { name: 'project 3', id: 4} }
];

var buildTypesLookup = {};
var buildTypesIndex = {	buildType: [] };
var builds = {};
for(var i = 0; i < buildTypes.length; i++){
	buildTypesLookup[buildTypes[i].id] = buildTypes[i];

	buildTypesIndex.buildType.push({
		id: buildTypes[i].id,
		name: buildTypes[i].name,
		href: buildTypes[i].href,
		projectName: buildTypes[i].project.name,
		projectId: buildTypes[i].project.id,
		webUrl: buildTypes[i].webUrl
	});

	if(buildTypes[i].id === 'bt3') { continue; } // unknown / bad build status
	builds[buildTypes[i].id] = {
		build: [{ 
		id: i + 1, 
		number: i + 1000, 
		buildTypeId: buildTypes[i].id, 
		status: i % 2 === 0 ? 'SUCCESS' : 'FAILURE'}]
	};
}

http.on('request', function(req, res){
	res.writeHead(200, {'Content-Type': 'application/json'});

	if(req.url.match(/^\/id:(\w+)$/g)){
		res.end(JSON.stringify(buildTypesLookup[RegExp.$1]));
	} else if(req.url.match(/^\/id:(\w+)\/builds/g)){
		res.end(JSON.stringify(builds[RegExp.$1]));
	} else {
		res.end(JSON.stringify(buildTypesIndex));
	}
});

function menu(){
	process.stdout.write('\nmenu:\n');
	for(var id in builds){
		process.stdout.write(id + ' - toggle status\n');
	}
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
