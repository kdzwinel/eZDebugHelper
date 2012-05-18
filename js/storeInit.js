//create a storage object and load default settings
var settings = new Store("settings", {
	'hideeZDebug': 'hide_used',
	'labelColorError': '#E2725B',
	'labelColorWarning': '#E3A857',
	'labelColorNotice': '#FADA5E',
	'labelColorDebug': '#99BADD',
	'labelColorTiming': '#00A86B',
			 
	'labelColorTemplateHead': '#EDC951',
	'labelColorTemplateBody': '#EB6841',
	'labelColorTemplateDefault': '#00A0B0',
	'showTemplatePath': 'requested',
	
	'errorMessageVisible': true,
	'warningMessageVisible': true,
	'noticeMessageVisible': true,
	'debugMessageVisible': true,
	'timingMessageVisible': false
});