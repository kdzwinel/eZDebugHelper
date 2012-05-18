var message = {
	title: "eZDebug Helper updated",
	body: "Settings page and adress bar icon were added.",
	version: "0.5"
};

function getVersion() {
	var details = chrome.app.getDetails();
	return details.version;
}

var currVersion = getVersion();
var prevVersion = localStorage['version'];

if (currVersion != prevVersion) {
	//if this is an update and message for this update is available
	if( typeof prevVersion != 'undefined' && message.version == currVersion ) {
		var notification = webkitNotifications.createNotification(
			'img/logo_48.png',
			message.title,
			message.body
		);
		notification.show();
		
		setTimeout(function() {
			if( notification ) {
				notification.cancel();
			}
		}, 5000);
	}

	localStorage['version'] = currVersion;
}