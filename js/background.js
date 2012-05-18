var defaultSettings = {
	'hideeZDebug': 'hide_used',
	'labelColorError': '#E2725B',
	'labelColorWarning': '#E3A857',
	'labelColorNotice': '#FADA5E',
	'labelColorDebug': '#99BADD',
	'labelColorTiming': '#00A86B',
	'labelColorTemplateHead': '#EDC951',
	'labelColorTemplateBody': '#EB6841',
	'labelColorTemplateDefault': '#00A0B0',
	'showTemplatePath': 'requested',
	
	'errorMessageVisible': true,
	'warningMessageVisible': true,
	'noticeMessageVisible': true,
	'debugMessageVisible': true,
	'timingMessageVisible': false
};
var settings = new Store("settings", defaultSettings);
  
//Proxy - transports messages between content script and dev tools
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	console.log(request);
	if(request.command == 'getSettings') {
		sendResponse(settings.toObject());
	} else if(request.command == 'isLoaded') {
		if(request.tabId === undefined) {
			console.log('Error - tabId undefined');
			return;
		}
		
		//checks is tab is fully loaded
		var attempt = 0;
		var maxAttempts = 4 * 60;//~60sec
		
		var interval = setInterval(function(){
			if(attempt > maxAttempts) {
				console.log('Error: maxAttempts for isLoaded reached.');
				clearInterval(interval);
				return;
			}
			attempt++;
			
			chrome.tabs.get(request.tabId, function(tab){
				//console.log('Tab status: ' + tab.status);
				//tab is loaded
				if(tab.status == 'complete') {
					chrome.tabs.sendRequest(tab.id, {command: "contentScriptLoaded"}, function(loaded) {
						//console.log('contentScriptLoaded ' + loaded );
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