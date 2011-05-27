(function($){
	$._gaq = $._gaq || [];
	
	$.trackingFor = function(accountId){
		$._gaq.push(['_setAccount', accountId]);
		$._gaq.push(['_trackPageview']);
		return {
			on: function(category, action, label, value){
				$._gaq.push(['_trackEvent', category, action, label, value]);
				return this;
			},
			send: function(){
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = 'https://ssl.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			}
		};
	};
})(this);

var getAppId = function(){
	var match = chrome.extension.getURL('').match(/:\/\/([a-z]+)\/);
	return	match ? match[1] : undefined;
};

$.getJSON(chrome.extension.getURL('/manifest.json')).success(function(manifest){
	trackingFor('UA-23600922-2')
	.on('about','appid',getAppId())
	.on('about','version',manifest.version)
	.send();
});
