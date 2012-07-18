function TemplateCommentReader() {
	var that = this;
	
	this.getTemplateName = function(comment) {
		var template = comment.match(/[^ ]+\.tpl/g);
		
		return template[0] || '';
	}
	
	this.processComments = function(element) {
		var templatePositions = {};
		var templateStack = [];
		var templateDepth = 0;

		element.find('*').not('iframe').contents().filter(function() {
			//getting only HTML comments from given set of elements
			return this.nodeType == 8;
		}).each(function(i, comment){
			var text = comment.nodeValue;
			
			if(text.substring(0, 8) == ' START: ') {
				var template = that.getTemplateName(text);
				
				templatePositions[template] = templatePositions[template] || [];
				
				var templateObj = {
					fileName: template,
					depth: templateDepth,
					inHead: ($(comment).closest('head').length > 0),
					inBody: ($(comment).closest('body').length > 0),
					commentObj: $(comment)
				};
				templatePositions[template].push(templateObj);
				
				templateStack.push(templateObj);
				
				/*var depthMarker = '';
				for(var i=0; i<templateDepth; i++) {
					depthMarker += '---';
				}
				
				console.log(depthMarker + ' ' + template);*/
				
				templateDepth++;
				
			} else if(text.substring(0, 7) == ' STOP: ') {
				if(templateDepth == 0) {
					console.log('Error: templateDepth == 0 !!');
					return;
				}
				
				var templateFileName = that.getTemplateName(text);
				var templateObj = templateStack.pop();
				
				if(templateObj.fileName != templateFileName) {
					console.error('Error: start template name (' + templateObj.fileName + ') is different than end template name (' + templateFileName + '). Skipping.');
					templateStack.push(templateObj);
					return;
				}
				
				templateObj.commentEndObj = $(comment);
				templateDepth--;
			}
		});

		var rootTreeNode = {
			fileName: 'root',
			parent: undefined,
			children: []
		};
		var currentTreeNode = rootTreeNode;
		var treeNodes = [rootTreeNode];

		var comments = element.html().match(/\<\!\-\- (START|STOP):([\s\S]+?)\-\-\>/g);

		for(idx in comments) {
			var comment = comments[idx].match(/\<\!\-\-([\s\S]+?)\-\-\>/)[1];
			
			if(comment.substring(0, 8) == ' START: ') {
				var template = that.getTemplateName(comment);

				var newTreeNode = {
					fileName: template,
					parent: currentTreeNode,
					children: []
				};
				currentTreeNode.children.push(newTreeNode);
				currentTreeNode = newTreeNode;
				treeNodes.push(newTreeNode);
			} else if(comment.substring(0, 7) == ' STOP: ') {
				//TODO check if tree is valid

				//TREE
				currentTreeNode = currentTreeNode.parent;
			}
		}

		//removing parent property to make it possible to create a JSON from rootTreeNode object (no circular references)
		for(idx in treeNodes) {
			var node = treeNodes[idx];
			delete node.parent;
		}

		console.log(rootTreeNode);
		
		return {
			positions: templatePositions,
			tree: rootTreeNode
		};
	}
}