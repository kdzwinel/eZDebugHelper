var toolbar = new DebugToolbar();
var settings = new Settings('ez_debug_toolbar');

$('document').ready(function(){
	var debug = $('#debug');
	
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
	
	var messagesList = new MessagesList();
	messagesList.process(tableRows);
	
	toolbar.addTab('Messages (' + messagesList.count() + ')', messagesList.render(), '');
	
	//TEMPLATES TAB
	var templatesTable = debug.find('#templateusage');
	templatesTable.hide();
	tableRows = templatesTable.find('tr.data');
	
	var templatesList = new TemplatesList();
	templatesList.process(tableRows);
	
	toolbar.addTab('Templates (' + templatesList.uniqueCount() + ')', templatesList.render(), '');
	
	//TEMPLATE POSITIONS
	var templateCommentReader = new TemplateCommentReader();
	templatesList.setTemplatePositions( templateCommentReader.processComments($('*')) );
	
	//TOOLBAR RENDERING
	var toolbarDiv = toolbar.render();
	$('body').append(toolbarDiv);
	
	//TOOLBAR MANIPULATION (DRAGGING / RESIZING)
	toolbarDiv.draggable({
		cursor: 'move',
		handle: '#debug_toolbar_small_list',
		axis: 'x',
		stop: function(event, ui) {
			settings.set('toolbar_position_x', $(this).css('left'));
		}
	});
	toolbarDiv.resizable({
		handles: 'w, e',
		stop: function(event, ui) {
			$(this).css("height", '').css("top", '').css("position", '');
			settings.set('toolbar_width', $(this).css('width'));
		}
	})
	
	//RESTORING TOOLBAR POSITION FROM SETTINGS
	if(settings.get('toolbar_position_x') != undefined) {
		toolbarDiv.css('left', settings.get('toolbar_position_x'));
	}
	if(settings.get('toolbar_width') != undefined) {
		toolbarDiv.css('width', settings.get('toolbar_width'));
	}
});