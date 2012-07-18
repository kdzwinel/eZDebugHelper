var messagesList;
var templatesList;
var debug;
var scriptLoaded = false;
var settings;

chrome.extension.sendRequest({command: 'getSettings'}, function(theSettings) {
	settings = theSettings;

	debug = $('#debug');
	
	if(debug.length > 0) {
		chrome.extension.sendRequest({command: 'showIcon'});
		
		//MESSAGES TAB
		var errorsTable = debug.find('table:eq(0)');
		
		var tableRows = errorsTable.find('tr');
		if(errorsTable.find('tr:eq(0) div.debug-toolbar').size() > 0) {//ignore debug toolbar if it is present in first row of a table
			tableRows = errorsTable.find('tr:gt(0)');
		}
		
		messagesList = new MessagesList();
		messagesList.process(tableRows);
		
		//TEMPLATES TAB
		var templatesTable = debug.find('#templateusage');
		tableRows = templatesTable.find('tr.data');
		
		templatesList = new TemplatesList();
		templatesList.process(tableRows);
		
		//TEMPLATE POSITIONS
		var templateCommentReader = new TemplateCommentReader();
		var templateDetails = templateCommentReader.processComments($('html'));
		templatesList.setTemplatePositions( templateDetails.positions );
		templatesList.setTemplateTree( templateDetails.tree );
		
		//optional - hide eZDebug
		if(settings.hideeZDebug == 'hide_used') {
			errorsTable.hide();
			templatesTable.hide();
		} else if(settings.hideeZDebug == 'hide_all') {
			debug.hide();
		}
	}
	
	scriptLoaded = true;
});

//HANDLE REQUESTS FROM DEV TOOLS PANELS
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	//console.log('CONTENT SCRIPT');
	//console.log(request.command);
	
	var response;
	
	if(request.command == "contentScriptLoaded") {
		response = scriptLoaded;
	} else if(request.command == "eZDebugEnabled") {
		response = (debug.length == 1);
	} else if(request.command == "getMessages") {
		response = messagesList.getMessages();
	} else if(request.command == "getTemplates") {
		response = {
			list: templatesList.getTemplates(),
			tree: templatesList.getTemplateTree()
		};
	} else if(request.command == "setVisibilityOfTemplatePositions") {
		templatesList.setVisibilityOfTemplatePositions(request.template, request.show);
	} else if(request.command == "hideAllTemplatePositions") {
		templatesList.hideAllTemplatePositions();
	}
	
	//console.log(response);
	sendResponse(response);
});