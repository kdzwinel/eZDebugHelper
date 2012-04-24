var eZPanels = new function() {
	var that = this;
	var panels = [];
	
	this.addPanel = function(panelName, panelObj) {
		var panel = this.getPanel(panelName);
		
		if(panel !== undefined) {
			panel.panelObj = panelObj;
		} else {
			panels.push({
				name: panelName,
				panelObj: panelObj
			});
		}
	}
	
	this.addWindow = function(panelName, windowObj) {
		var panel = this.getPanel(panelName);
		
		if(panel !== undefined) {
			panel.windowObj = windowObj;
		}
	}
	
	this.count = function() {
		return panels.length;
	}
	
	this.getPanel = function(panelName) {
		for(index in panels) {
			var panel = panels[index];
			
			if(panel.name == panelName) {
				return panel;
			}
		}
	}
	
	this.restartAll = function() {
		for(index in panels) {
			var panel = panels[index];
			
			if(panel.windowObj !== undefined) {
				panel.windowObj.init();
			}
		}
	}
};

var inspectedTab = {
	onLoad: function(callback) {
		var that = this;
		this.sendCommand("isLoaded", callback);
	},
	eZDebugOn: function(success, error) {
		this.sendCommand("eZDebugEnabled", function(eZDebugEnabled) {
			eZDebugEnabled ? success() : error();
		});
	},
	sendCommand: function(command, callback) {
		chrome.extension.sendRequest({tabId: chrome.devtools.inspectedWindow.tabId, command: command}, callback);
	}
};

function addPanels() {
	console.log('Panels added');

	chrome.devtools.panels.create("eZMessages", "img/icon_24.png", "eZMessages.html", function(panel) {
		eZPanels.addPanel("eZMessages", panel);  
	
		/*panel.onSearch.addListener(function(){
			console.log('test');
			alert('test');
		});*/
		
		panel.onShown.addListener(function(window) {
			console.log('eZMessages onShown');
			
			eZPanels.addWindow("eZMessages", window);
		});
	});


	chrome.devtools.panels.create("eZTemplates", "img/icon_24.png", "eZTemplates.html", function(panel) {
		eZPanels.addPanel("eZTemplates", panel);  
		
		/*panel.onSearch.addListener(function(action, queryString) {
			console.log('eZTemplates onSearch ' + queryString);
			console.log(action);
			
			var eZPanel = eZPanels.getPanel("eZTemplates");
			
			if(eZPanel !== undefined && eZPanel.windowObj !== undefined) {
				eZPanel.windowObj.search(queryString);
			}
		});*/
		
		panel.onShown.addListener(function(window) {
			console.log('eZTemplates onShown');
			
			eZPanels.addWindow("eZTemplates", window);
			window.showAllOverlay();
		});
		
		panel.onHidden.addListener(function() {
			console.log('eZTemplates onHidden');
			
			var eZPanel = eZPanels.getPanel("eZTemplates");
			
			if(eZPanel !== undefined && eZPanel.windowObj !== undefined) {
				eZPanel.windowObj.hideAllOverlay();
			}
		});
	});
}

chrome.devtools.network.onNavigated.addListener(function(url) {
	console.log('eZTemplates onNavigated ' + url);
	
	if(eZPanels.length == 0) {
		tryToAddPanels();
	} else {
		//reload all panels when page reloads
		inspectedTab.onLoad(function() {
			eZPanels.restartAll();
		});
	}
});

function tryToAddPanels() {
	console.log('tryToAddPanels');
	if(eZPanels.count() > 0) {
		return;
	}
	
	//add eZDebug panels only when current page is eZPublish page with debug info shown
	inspectedTab.onLoad(function() {
		inspectedTab.eZDebugOn(function() {
			addPanels();
		}, function() {
			waitForAnotherPageToLoad();
		});
	});
}

tryToAddPanels();