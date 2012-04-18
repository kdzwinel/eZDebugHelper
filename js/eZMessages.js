var messagesList;
var settings = new Settings();

function init() {
	console.log('eZMessages init');
	
	//ask content script for data
	chrome.extension.sendRequest({tabId: chrome.devtools.inspectedWindow.tabId, command: "getMessages"}, function(messages) {
		console.log('eZMessages getMessages');
		
		messagesList = new MessagesList();
		messagesList.setMessages(messages);
		//display data
		$('#debug_toolbar').html(messagesList.render());
	});
}

init();