function MessagesList() {
	var messages = []
	var listDiv;
	var that = this;
	
	this.process = function(tableRows) {
		messages = [];
		
		tableRows.each(function(i,item){
			if(i%2 != 0) {
				return;
			}
			
			var header = $(this);
			var content = $(this).next();
			
			messages.push({
				class: header.attr('class'),
				title: header.find('.debugheader:eq(0)').text(),
				time: header.find('.debugheader:eq(1)').text(),
				content: content.find('td pre').html()
			});
		});
	}
	
	this.getMessages = function() {
		return messages;
	}
	
	this.setMessages = function(newMessages) {
		messages = newMessages;
	}
	
	this.count = function(type) {
		var count = 0;
		
		for(index in messages) {
			var message = messages[index];
			
			if(type == undefined || type == message.class) {
				count++;
			}
		}
		
		return count;
	}
	
	this.filterMessages = function() {
		if(listDiv == undefined) {
			return false;
		}
		
		var messageList = listDiv.find('.debug_messages');
		var checkboxes = listDiv.find('.debug_messages_menu input[type=checkbox]');
		
		$(checkboxes).each(function(i,item) {
			var checkbox = $(item);
			var messageType = checkbox.val();
			
			if(checkbox.is(':checked')) {
				messageList.find('li.' + messageType).show();
			} else {
				messageList.find('li.' + messageType).hide();
			}
		});
	}
	
	this.render = function() {
		listDiv = $('<div>');
		
		var debugMessagesMenu = $('<ul>').addClass('debug_messages_menu').addClass('clearfix');
		listDiv.append(debugMessagesMenu);
		
		var messageTypes = ['error', 'warning', 'notice', 'debug', 'timing'];
		for(index in messageTypes) {
			var messageType = messageTypes[index];
			
			var menuCheckbox = $('<input>').attr('type', 'checkbox').attr('id', 'message_filter_' + messageType).val(messageType);
			var menuLabel = $('<label>').attr('for', 'message_filter_' + messageType).text(messageType + ' (' + that.count(messageType) + ')');
			
			//if(settings.get(messageType + '_visible', true)) {
			//	menuCheckbox.attr('checked', 'checked');
			//}
			
			menuCheckbox.change(function(){
				//settings.set($(this).val() + '_visible', $(this).is(':checked'));
				that.filterMessages();
			});
			var menuLi = $('<li>').append(menuCheckbox).append(' ').append(menuLabel);
			
			debugMessagesMenu.append(menuLi);
		}
		
		var debugMessages = $('<ul>').addClass('debug_messages');
		listDiv.append(debugMessages);
		
		for(index in messages) {
			var message = messages[index];
			var messageBody = $('<li>').click(function(){
				$(this).toggleClass('full');
			}).addClass(message.class).html('<span class="debug_message_label">' + message.title + '</span> ' + message.content);
			
			
			debugMessages.append(messageBody);
		}
		
		that.filterMessages();
		
		return listDiv;
	}
}