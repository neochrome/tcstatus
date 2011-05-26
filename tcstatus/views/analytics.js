$.getJSON(chrome.extension.getURL('/manifest.json'), function(manifest){
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-23600922-2']);
	_gaq.push(['_setDomainName', 'tcstatus.chrome-extensions.com']);
	_gaq.push(['_trackPageview']);
	_gaq.push(['_trackEvent','about','version',manifest.version]);

	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
});
