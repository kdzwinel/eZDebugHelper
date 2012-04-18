function TemplateCommentReader() {
	var that = this;
	
	this.getTemplateName = function(comment) {
		var template = comment.match(/[^ ]+\.tpl/g);
		
		return template[0] || '';
	}
	
	this.processComments = function(elements) {
		var templatePositions = {};
		var templateStack = [];
		var templateDepth = 0;
		
		elements.not('iframe').contents().filter(function() {
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
					console.log('Error: start template name is different than end template name');
					return;
				}
				
				templateObj.commentEndObj = $(comment);
				templateDepth--;
			}
		});
		
		return templatePositions;
	}
}