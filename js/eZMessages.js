var messagesList;

//display data
function displayData() {
	$('#debug_toolbar').html(messagesList.render());
}

//ask content script for data
chrome.extension.sendRequest({command: "eZDebugEnabled"}, function(eZDebugEnabled) {
	if(eZDebugEnabled) {
		chrome.extension.sendRequest({command: "getMessages"}, function(messages) {
			messagesList = new MessagesList();
			messagesList.setMessages(messages);
			displayData();
			
			/*chrome.extension.sendRequest({command: "getTemplates"}, function(templates) {
			  
				chrome.extension.sendRequest({command: "getTemplatePositions"}, function(templatePositions) {
					displayData();
				});
			});*/
		});

	}
});