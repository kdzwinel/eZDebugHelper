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

function failback() {
	$('#debug_toolbar').slideUp('fast', function(){
		$(this).empty();
		$(this).html('<p class="note">eZDebug is not available on this page.</p>');
		$(this).slideDown('fast');
	});
}

init();