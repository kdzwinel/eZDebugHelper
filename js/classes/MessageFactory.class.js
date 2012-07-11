function MessageFactory() {
	this.createMessage = function(config) {
		var title = config.hasOwnProperty('title') ? config.title : null;
		
		//For all types of databases debug message is outputed by a common interface (ezdbinterface.php@353) in the same format
		if(title && title.indexOf("::query(") != -1) {
			return new QueryMessage(config);
		}
		
		return new Message(config);
	}

	this.classify = function(messages) {
		var message;
		for(idx in messages) {
			message = messages[idx];

			if(message.type == 'dbquery') {
				message.__proto__ = QueryMessage.prototype;
			} else {
				message.__proto__ = Message.prototype;
			}
		}
		return messages;
	}
}