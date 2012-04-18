//add eZDebug panels only when current page is eZPublish page with debug info shown
chrome.extension.sendRequest({tabId: chrome.devtools.inspectedWindow.tabId, command: "eZDebugEnabled"}, function(eZDebugEnabled) {
	if(eZDebugEnabled) {
		chrome.devtools.panels.create("eZMessages", "img/icon_24.png", "eZMessages.html", function(panel) {
			panel.onSearch.addListener(function(action, queryString) {

			});
			
			panel.onShown.addListener(function(window) {
				console.log('eZMessages onShown');
				
				chrome.devtools.network.onNavigated.addListener(function(url) {
					console.log('eZTemplates onNavigated');
					
					var interval = setInterval(function(){
						chrome.extension.sendRequest({tabId: chrome.devtools.inspectedWindow.tabId, command: "isLoaded"}, function(response) {
							if(response){
								clearInterval(interval);
								window.init();
							}
						});
					}, 250);
				});
			});
		});

		chrome.devtools.panels.create("eZTemplates", "img/icon_24.png", "eZTemplates.html", function(panel) {
			panel.onSearch.addListener(function(action, queryString) {

			});
			
			panel.onShown.addListener(function(window) {
				console.log('eZTemplates onShown');
				
				chrome.devtools.network.onNavigated.addListener(function(url) {
					console.log('eZTemplates onNavigated');
					
					var interval = setInterval(function(){
						chrome.extension.sendRequest({tabId: chrome.devtools.inspectedWindow.tabId, command: "isLoaded"}, function(response) {
							if(response){
								clearInterval(interval);
								window.init();
							}
						});
					}, 250);
				});
			});
		});
	}
});