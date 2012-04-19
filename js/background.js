//Proxy - transports messages between content script and dev tools
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if(request.command == 'isLoaded') {
		//checks is tab is fully loaded
		var interval = setInterval(function(){
			chrome.tabs.get(request.tabId, function(tab){
				if(tab.status == 'complete') {
					clearInterval(interval);
					sendResponse(true);
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