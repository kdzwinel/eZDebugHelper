var messagesList;

function init() {
	//create CSS file with label colors set by user
	var labelColorsCSS = $('<style>');
	var labels = {
		"labelColorTemplateHead": "error",
		"labelColorTemplateBody": "warning",
		"labelColorTemplateDefault": "notice"
	};
	
	labelColorsCSS.append("#debug_toolbar .debug_templates li { background-color: " + settings.get("labelColorTemplateDefault") + "; }");
	labelColorsCSS.append("#debug_toolbar .debug_templates li.template_position_head { background-color: " + settings.get("labelColorTemplateHead") + "; }");
	labelColorsCSS.append("#debug_toolbar .debug_templates li.template_position_body { background-color: " + settings.get("labelColorTemplateBody") + "; }");
	
	//append auto-generated styles to body
	$(document).ready(function(){
		$('body').append(labelColorsCSS);
	});

	//ask content script for data
	chrome.extension.sendRequest({tabId: chrome.devtools.inspectedWindow.tabId, command: "getTemplates"}, function(templates) {
		templatesList = new TemplatesList();
		templatesList.setTemplates(templates);
		
		$(document).ready(function() {
			//display data
			$('#debug_toolbar').html(templatesList.render({
				showTemplatePath: settings.get("showTemplatePath")
			}));
			
			//send request to content script if template name was clicked
			$('#debug_toolbar .debug_templates li').click(function(){
				var detailsDiv = $(this).find('div.details');
				
				chrome.extension.sendRequest({tabId: chrome.devtools.inspectedWindow.tabId, command: "setVisibilityOfTemplatePositions", template: detailsDiv.data('templateUsed'), show: detailsDiv.is(':visible')});
			});
		});
	});
}

function failback() {
	$('#debug_toolbar').slideUp('fast', function(){
		$(this).empty();
		$(this).html('<p class="note">eZDebug is not available on this page.</p>');
		$(this).slideDown('fast');
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