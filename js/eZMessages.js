var previousMessagesList;
var messagesList;
var settings;

function init() {
	console.log('eZMessages init');
	
	//load settings
	chrome.extension.sendRequest({command: 'getSettings'}, function(theSettings) {
		settings = theSettings;
		
		//create CSS file with label colors set by user
		var labelColorsCSS = $('<style>');
		var labels = {
			"labelColorError": "error",
			"labelColorWarning": "warning",
			"labelColorNotice": "notice",
			"labelColorDebug": "debug",
			"labelColorTiming": "timing"
		};
		
		for(settingName in labels) {
			var messageTypeClass = labels[settingName];
			var labelColor = settings[settingName];
			
			console.log(labelColor, messageTypeClass, settingName);
			labelColorsCSS.append("#debug_toolbar .debug_messages li." + messageTypeClass + " { background-color: " + labelColor + "; }");
		}

		//append auto-generated styles to body
		$(document).ready(function(){
			$('body').append(labelColorsCSS);
		});


	
		//ask content script for data
		chrome.extension.sendRequest({tabId: chrome.devtools.inspectedWindow.tabId, command: "getMessages"}, function(messages) {
			console.log('eZMessages getMessages');
			
			if( messagesList ) {
				previousMessagesList = messagesList;
			}
			
			messagesList = new MessagesList();
			messagesList.setMessages(messages);
			
			//show difference between old message log and a new one
			if( previousMessagesList ) {
				messagesList.highlightNewMessages( previousMessagesList );
			}
			
			$(document).ready(function() {
				//display data
				$('#debug_toolbar').html(messagesList.render({
					errorMessageVisible: settings.errorMessageVisible,
					warningMessageVisible: settings.warningMessageVisible,
					noticeMessageVisible: settings.noticeMessageVisible,
					debugMessageVisible: settings.debugMessageVisible,
					timingMessageVisible: settings.timingMessageVisible,
					dbqueryMessageVisible: settings.dbqueryMessageVisible,
					
					onFilterChange: function(checkbox) {
						var settingName = checkbox.val() + 'MessageVisible';
						var settingValue = checkbox.is(':checked');
						
						settings[settingName] = settingValue;
						chrome.extension.sendRequest({command: 'setSetting', settingName: settingName, settingValue: settingValue});
					}
				}));
			
				//highlight new messages (that are not hidden by filtering)
				$('#debug_toolbar .debug_messages li.is_new:visible').effect('highlight', {}, 2500);
			});
		});
	});
}

function failback() {
	$('#debug_toolbar').slideUp('fast', function(){
		$(this).empty();
		$(this).html('<p class="note">eZDebug is not available on this page.</p>');
		$(this).slideDown('fast');
	});
}

init();