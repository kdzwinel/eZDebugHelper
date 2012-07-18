function TemplatesList() {
	this.popupPositioner;
	var templates = []
	var templatePositions;
	var templateTree;
	var that = this;
	
	this.process = function(tableRows) {
		templates = [];
		
		tableRows.each(function(i,item){
			templates.push({
				usage: $(item).find('td:eq(0)').text(),
				requested: $(item).find('td:eq(1)').text(),
				template: $(item).find('td:eq(2)').text().replace(/[<>]/g, ''),
				used: $(item).find('td:eq(3)').text()
			});
		});
	}
	
	this.getTemplates = function() {
		return templates;
	}
	
	this.setTemplates = function(newTemplates) {
		templates = newTemplates;
	}
	
	this.uniqueCount = function() {
		return templates.length;
	}
	
	this.count = function() {
		var count = 0;
		
		for(index in templates) {
			var template = templates[index];
			count += template.usage;
		}
		
		return count;
	}
	
	this.render = function(config) {
		var listDiv = $('<div>');
		
		var debugTemplates = $('<ul>').addClass('debug_templates');
		listDiv.append(debugTemplates);
		
		for(index in templates) {
			var template = templates[index];
			var details = $('<div>').addClass('details').data('templateUsed', template.used);
			details.append('<p><span>Usage</span>: ' + template.usage + '</p>');
			details.append('<p><span>Requested template</span>: ' + template.requested + '</p>');
			details.append('<p><span>Template</span>: ' + template.template + '</p>');
			details.append('<p><span>Template loaded</span>: ' + template.used + '</p>');
			
			var templateShownByDefault = template.requested;
			if(config.hasOwnProperty('showTemplatePath') && config.showTemplatePath == 'loaded') {
				templateShownByDefault = template.used;
			}
			var messageTitle = $('<div>').addClass('title').text(templateShownByDefault + ' ').click(function(){
				$(this).siblings('.details').slideToggle().toggleClass('shown');
			});
			
			var messageBody = $('<li>').addClass('template_position_' + template.DOMPosition).append(messageTitle).append(details);
			
			template.listBox = messageBody;
			
			debugTemplates.append(messageBody);
		}
		
		return listDiv;
	}

	this.renderTree = function(config) {
		var treeDiv = $('<div>');
		
		var debugTemplates = $('<ul>').addClass('debug_templates');
		treeDiv.append(debugTemplates);

		//don't render root node, only it's children
		for(idx in that.templateTree.children) {
			var child = that.templateTree.children[idx];

			renderTreeNode({
				node: child,
				wrapper: debugTemplates,
				showTemplatePath: config.showTemplatePath
			});
		}
		
		return treeDiv;
	}

	var renderTreeNode = function(config) {
		var template = getTemplateByFileName( config.node.fileName );

		var messageChildren = $('<ul>');
		var details = $('<div>').addClass('details').data('templateUsed', template.used).append(messageChildren);

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

		var messageBody = $('<li>').addClass('template_position_' + template.DOMPosition).append(messageTitle).append(details);

		for(idx in config.node.children) {
			var child = config.node.children[idx];

			renderTreeNode({
				node: child,
				wrapper: messageChildren,
				showTemplatePath: config.showTemplatePath
			});
		}

		config.wrapper.append(messageBody);
	}

	var getTemplateByFileName = function(file) {
		for(idx in templates) {
			var template = templates[idx];

			if(template.used == file) {
				return template;
			}
		}
	}
	
	this.setTemplatePositions = function(templatePositionsArray) {
		that.templatePositions = templatePositionsArray;
		
		//check each comment position associated with each template and add additional classes to list objects:
		//template_not_visible - if no comment is associated with template
		//template_in_head / body - if template is inside head/body element
		for(index in templates) {
			var template = templates[index];
			var templatePositionData = that.templatePositions[template.used];
			
			if(templatePositionData === undefined) {
				template.DOMPosition = "unknown";
				continue;
			}
		
			//NOTE we are basing on a first comment for given template - this may sometimes return false results
			if(templatePositionData[0].inHead) {
				template.DOMPosition = "head";
			}else if(templatePositionData[0].inBody) {
				template.DOMPosition = "body";;
			}
		}
	}

	this.getTemplateTree = function() {
		return that.templateTree;
	}

	this.setTemplateTree = function(treeRootNode) {
		that.templateTree = treeRootNode;
	}
	
	this.setVisibilityOfTemplatePositions = function(templateFile, popupShow) {
		var templatePositionData = that.templatePositions[templateFile];
		
		if(templatePositionData === undefined) {
			return;
		}
		
		var topPopup;
		$.each(templatePositionData, function(i, positionObj) {
			if(positionObj.popupObj === undefined) {
				var popupObj = $('<div>').addClass('ezdebug_template_infobox').data('templateUsed', templateFile).attr('title', templateFile);
				
				//positions popup over template content
				that.popupPositioner = that.popupPositioner || new PopupPositioner();
				that.popupPositioner.setPopupPosition(popupObj, positionObj.commentObj, positionObj.commentEndObj);
				
				positionObj.popupObj = popupObj;
			} else {
				if(popupShow) {
					positionObj.popupObj.fadeIn('fast');
				} else {
					positionObj.popupObj.fadeOut('fast');
				}
			}
			
			//get the top most (visible) popup
			if( positionObj.popupObj.is(':visible') && (topPopup === undefined || topPopup.offset().top > positionObj.popupObj.offset().top) ) {
				topPopup = positionObj.popupObj;
			}
		});
		
		//scroll to top most popup
		if(popupShow && topPopup !== undefined) {
			$('html,body').animate({scrollTop: topPopup.offset().top}, 'slow');
		}
	}
	
	this.hideAllTemplatePositions = function() {
		$('div.ezdebug_template_infobox').fadeOut('fast');
	}
	
	this.search = function(queryString) {
		var regex = new RegExp(queryString, "i");
		
		for(index in templates) {
			var template = templates[index];
			
			if(template.requested.search(regex) || template.template.search(regex) || template.used.search(regex)) {
				template.listBox.css('border', 'solid red 1px');
			}
		}
	}
}