var messagesList;
var templatesList;
var debug;

$(document).ready(function(){
	debug = $('#debug');
	
	if(debug.length == 0) {
		return;
	}
	
	//MESSAGES TAB
	var errorsTable = debug.find('table:eq(0)');
	errorsTable.hide();
	
	var tableRows = errorsTable.find('tr');
	if(errorsTable.find('tr:eq(0) div.debug-toolbar').size() > 0) {//ignore debug toolbar if it is present in first row of a table
		tableRows = errorsTable.find('tr:gt(0)');
	}
	
	messagesList = new MessagesList();
	messagesList.process(tableRows);
	
	//TEMPLATES TAB
	var templatesTable = debug.find('#templateusage');
	templatesTable.hide();
	tableRows = templatesTable.find('tr.data');
	
	templatesList = new TemplatesList();
	templatesList.process(tableRows);
	
	//TEMPLATE POSITIONS
	var templateCommentReader = new TemplateCommentReader();
	templatesList.setTemplatePositions( templateCommentReader.processComments($('*')) );
});

//HANDLE REQUESTS FROM DEV TOOLS PANELS
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	//console.log('CONTENT SCRIPT');
	//console.log(request.command);
	
	var response;
	
	if(request.command == "eZDebugEnabled") {
		response = (debug.length == 1);
	} else if(request.command == "getMessages") {
		response = messagesList.getMessages();
	} else if(request.command == "getTemplates") {
		response = templatesList.getTemplates();
	} else if(request.command == "setVisibilityOfTemplatePositions") {
		templatesList.setVisibilityOfTemplatePositions(request.template, request.show);
	}
	
	//console.log(response);
	sendResponse(response);
});