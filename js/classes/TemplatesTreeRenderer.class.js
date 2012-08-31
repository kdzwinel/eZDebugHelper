function TemplatesTreeRenderer() {
	this.render = function(templatesList, config) {
		if(!(templatesList instanceof TemplatesList)) {
			console.error('Invalid artugment.');
			return;
		}
		var templateTree = templatesList.getTemplateTree();

		var treeDiv = $('<div>');
		
		var debugTemplates = $('<ul>').addClass('debug_templates');
		treeDiv.append(debugTemplates);

		//don't render root node, only it's children
		for(idx in templateTree.children) {
			var child = templateTree.children[idx];

			renderTreeNode({
				templatesList: templatesList,
				node: child,
				wrapper: debugTemplates,
				showTemplatePath: config.showTemplatePath
			});
		}
		
		return treeDiv;
	}

	var renderTreeNode = function(config) {
		var template = config.templatesList.getTemplateByFileName(config.node.fileName);

		var messageChildren = $('<ul>');
		var details = $('<div>').addClass('details').data('templateUsed', template.used).append("blah blah");//.append(messageChildren);

		var templateShownByDefault = template.requested;
		if(config.hasOwnProperty('showTemplatePath') && config.showTemplatePath == 'loaded') {
			templateShownByDefault = template.used;
		}
		var messageTitle = $('<div>').addClass('title').text(templateShownByDefault + ' ');

		//only nodes with children should be expandable
		if(config.node.children.length > 0) {
			messageTitle.click(function(){
				$(this).siblings('.details').slideToggle().toggleClass('shown');
			});
		}

		var messageBody = $('<li>').addClass('template_position_' + template.DOMPosition).append(messageTitle).append(details).append(messageChildren);

		for(idx in config.node.children) {
			var child = config.node.children[idx];

			renderTreeNode({
				templatesList: templatesList,
				node: child,
				wrapper: messageChildren,
				showTemplatePath: config.showTemplatePath
			});
		}

		config.wrapper.append(messageBody);
	}
}