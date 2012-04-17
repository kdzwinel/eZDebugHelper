function DebugToolbar() {
	var that = this;
	var tabs = [];
	var toolbarBody;
	
	this.addTab = function(name, content, icon) {
		tabs.push({
			'name': name,
			'content': content,
			'icon': icon
		});
	}
	
	this.toggleTab = function(tabIdx) {
		toolbarBody.find('#debug_tab_' + tabIdx).toggle().siblings().hide();
		
		if(toolbarBody.find('.debug_tab:visible').size() > 0) {
			settings.set('selected_tab', tabIdx);
		} else {
			settings.set('selected_tab', undefined);
		}
	}
	
	this.hideTabs = function() {
		toolbarBody.find('.debug_tab').hide();
	}
	
	this.render = function() {
		if(toolbarBody != undefined) {
			toolbarBody.remove();
		}
		
		toolbarBody = $('<div>').attr('id', 'debug_toolbar');
		
		var smallList = $('<ul>').attr('id', 'debug_toolbar_small_list').addClass('clearfix');
		toolbarBody.append(smallList);
		
		var tabsBody = $('<div>').attr('id', 'debug_toolbar_tabs');
		toolbarBody.append(tabsBody);
		
		var selectedTab = settings.get('selected_tab');
		
		for(index in tabs) {
			var tab = tabs[index];
			
			var tabHeadLink = $('<a>').click(function(){
				var tabIdx = $(this).data('tab_idx');
				that.toggleTab(tabIdx);
				
				return false;
			}).attr('href', '#').data('tab_idx', index).text(tab.name);
			var tabHead = $('<li>').append(tabHeadLink);
			
			smallList.append(tabHead);
			
			var tabBody = $('<div>').addClass('debug_tab').attr('id', 'debug_tab_' + index).append(tab.content);
			
			tabsBody.append(tabBody);
			
			if(selectedTab != index) {
				tabBody.hide();
			}
		}
		
		return toolbarBody;
	}
}