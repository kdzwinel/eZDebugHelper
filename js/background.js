//Proxy - transports messages between content script and dev tools
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	console.log(request);
	if(request.command == 'isLoaded') {
		if(request.tabId === undefined) {
			console.log('Error - tabId undefined');
			return;
		}
		
		//checks is tab is fully loaded
		var interval = setInterval(function(){
			chrome.tabs.get(request.tabId, function(tab){
				//tab is loaded
				if(tab.status == 'complete') {
					chrome.tabs.sendRequest(tab.id, {command: "contentScriptLoaded"}, function(loaded) {
						//content script is responding, document.ready was executed
						if(loaded) {
							clearInterval(interval);
							sendResponse(true);
						}
					});
				}
			});
		}, 250);
	} else {
		chrome.tabs.get(request.tabId, function(tab) {
			chrome.tabs.sendRequest(tab.id, request, function(response) {
				sendResponse(response);
			});
		});
	}
});