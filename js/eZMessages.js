var previousMessagesList;
var messagesList;
var settings = new Settings();

function init() {
	console.log('eZMessages init');
	
	//ask content script for data
	chrome.extension.sendRequest({tabId: chrome.devtools.inspectedWindow.tabId, command: "getMessages"}, function(messages) {
		console.log('eZMessages getMessages');
		
		if( messagesList ) {
			previousMessagesList = messagesList;
		}
		
		messagesList = new MessagesList();
		messagesList.setMessages(messages);
		
		//show difference between old message log and new one - highlight new messages
		if( previousMessagesList ) {
			messagesList.highlightNewMessages( previousMessagesList );
		}
		
		//display data
		$('#debug_toolbar').html(messagesList.render());
		
		$('#debug_toolbar .debug_messages li.is_new').effect('highlight', {}, 2500);
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