function Message(config) {
	this.title = config.title;
	this.type = config.type;
	this.time = config.time;
	this.content = config.content;
}

Message.prototype.render = function() {
	return this.content;
}

Message.prototype.equals = function(otherMessage) {
	return otherMessage.content == this.content &&
		otherMessage.title == this.title &&
		otherMessage.type == this.type;
}