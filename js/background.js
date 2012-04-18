//Proxy - transports messages between content script and dev tools
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if(request.command == 'isLoaded') {
		chrome.tabs.get(request.tabId, function(tab){
			console.log('isComplete?' + tab.status);
			sendResponse(tab.status == 'complete');
		});
	} else {
		chrome.tabs.get(request.tabId, function(tab) {
			chrome.tabs.sendRequest(tab.id, request, function(response) {
				sendResponse(response);
			});
		});
	}
});