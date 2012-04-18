chrome.devtools.panels.create("eZMessages", "icon_24.png", "eZMessages.html", function(panel) {
	//panel.createStatusBarButton('eZMessages.png','button',true);
	panel.onSearch.addListener(function(action, queryString) {
	 	//console.log('onSearch action:' + queryString);
	});
	
	panel.onShown.addListener(function(window) {
	 	//console.log('onShown action:' + window);
	});
});