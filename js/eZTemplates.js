var messagesList;

function init() {
	//ask content script for data
	chrome.extension.sendRequest({tabId: chrome.devtools.inspectedWindow.tabId, command: "getTemplates"}, function(templates) {
		templatesList = new TemplatesList();
		templatesList.setTemplates(templates);
		//display data
		$('#debug_toolbar').html(templatesList.render());
		
		//send request to content script if template name was clicked
		$('#debug_toolbar .debug_templates li').click(function(){
			var detailsDiv = $(this).find('div.details');
			
			chrome.extension.sendRequest({tabId: chrome.devtools.inspectedWindow.tabId, command: "setVisibilityOfTemplatePositions", template: detailsDiv.data('templateUsed'), show: detailsDiv.is(':visible')});
		});
	});
}

function search(queryString) {
	templatesList.search(queryString);
}

function hideAllOverlay() {
	chrome.extension.sendRequest({tabId: chrome.devtools.inspectedWindow.tabId, command: "hideAllTemplatePositions"});
}

function showAllOverlay() {
	$.each($('#debug_toolbar .debug_templates li div.details:visible'), function(i, details) {
		var detailsDiv = $(details);
		chrome.extension.sendRequest({tabId: chrome.devtools.inspectedWindow.tabId, command: "setVisibilityOfTemplatePositions", template: detailsDiv.data('templateUsed'), show: true});
	});
}

init();