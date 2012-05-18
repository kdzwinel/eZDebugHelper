function isValidColor(color) {
	return color.test(/^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/);
}
	
window.addEvent("domready", function () {
	var settings = new FancySettings("eZDebug Helper", "../../img/logo_48.png");
    
	//General
	var hideeZDebug = settings.create({
		"tab": i18n.get("General"),
		"group": i18n.get("General"),
		"name": "hideeZDebug",
		"type": "radioButtons",
		"label": i18n.get("Default eZDebug output"),
		"options": [
		    ["hide_used", i18n.get("hide information about messages and templates")],
		    ["hide_all", i18n.get("hide everything")],
		    ["do_nothing", i18n.get("do nothing")]
		]
	});
	
	//eZMessages
	var labelColors = [];
	
	labelColors.push(settings.create({
		"tab": i18n.get("eZMessages tab"),
		"group": i18n.get("Label colors"),
		"name": "labelColorError",
		"type": "text",
		"label": i18n.get("error"),
		"text": "#FFFFFF",
		"validation": isValidColor
	}));
	
	labelColors.push(settings.create({
		"tab": i18n.get("eZMessages tab"),
		"group": i18n.get("Label colors"),
		"name": "labelColorWarning",
		"type": "text",
		"label": i18n.get("warning"),
		"text": "#FFFFFF",
		"validation": isValidColor
	}));
	
	labelColors.push(settings.create({
		"tab": i18n.get("eZMessages tab"),
		"group": i18n.get("Label colors"),
		"name": "labelColorNotice",
		"type": "text",
		"label": i18n.get("notice"),
		"text": "#FFFFFF",
		"validation": isValidColor
	}));
	
	labelColors.push(settings.create({
		"tab": i18n.get("eZMessages tab"),
		"group": i18n.get("Label colors"),
		"name": "labelColorDebug",
		"type": "text",
		"label": i18n.get("debug"),
		"text": "#FFFFFF",
		"validation": isValidColor
	}));
	
	labelColors.push(settings.create({
		"tab": i18n.get("eZMessages tab"),
		"group": i18n.get("Label colors"),
		"name": "labelColorTiming",
		"type": "text",
		"label": i18n.get("timing"),
		"text": "#FFFFFF",
		"validation": isValidColor
	}));
	
	//eZTemplates
	var showTemplatePath = settings.create({
		"tab": i18n.get("eZTemplates tab"),
		"group": i18n.get("General"),
		"name": "showTemplatePath",
		"type": "radioButtons",
		"label": i18n.get("Show template path that was"),
		"options": [
		    ["requested", i18n.get("requested")],
		    ["loaded", i18n.get("loaded")]
		]
	});
	
	labelColors.push(settings.create({
		"tab": i18n.get("eZTemplates tab"),
		"group": i18n.get("Label colors"),
		"name": "labelColorTemplateHead",
		"type": "text",
		"label": i18n.get("&lt;head&gt; template"),
		"text": "#FFFFFF",
		"validation": isValidColor
	}));
	
	labelColors.push(settings.create({
		"tab": i18n.get("eZTemplates tab"),
		"group": i18n.get("Label colors"),
		"name": "labelColorTemplateBody",
		"type": "text",
		"label": i18n.get("&lt;body&gt; template"),
		"text": "#FFFFFF",
		"validation": isValidColor
	}));
	
	labelColors.push(settings.create({
		"tab": i18n.get("eZTemplates tab"),
		"group": i18n.get("Label colors"),
		"name": "labelColorTemplateDefault",
		"type": "text",
		"label": i18n.get("default"),
		"text": "#FFFFFF",
		"validation": isValidColor
	}));
	
	for(var i=0; i<labelColors.length; i++) {
		var labelColor = labelColors[i];
		
		labelColor.addEvent("action", function(value) {
			this.label.setStyle('backgroundColor', value);
		});
		labelColor.label.setStyle('backgroundColor', labelColor.get());
	}
});
