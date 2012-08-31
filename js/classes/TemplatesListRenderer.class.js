function TemplatesListRenderer() {
	this.render = function(templatesList, config) {
		if(!(templatesList instanceof TemplatesList)) {
			console.error('Invalid artugment.');
			return;
		}
		var templates = templatesList.getTemplates();

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
}