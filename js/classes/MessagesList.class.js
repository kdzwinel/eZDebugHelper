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
	
	this.highlightNewMessages = function(messagesList) {
		if( !(messagesList instanceof MessagesList) ) {
			console.error('Invalid object type, MessagesList was expected.');
			return;
		}
		
		var oldMessages = messagesList.getMessages();
		
		for(index in messages) {
			var message = messages[index];
			var isNew = true;
			
			for(oindex in oldMessages) {
				var oldMessage = oldMessages[oindex];
				
				if(oldMessage.content == message.content && oldMessage.title == message.title && oldMessage.class == message.class) {
					isNew = false;
					break;
				}
			}
			
			message.isNew = isNew;
		}
	}
	
	this.render = function(config) {
		listDiv = $('<div>');
		
		var debugMessagesMenu = $('<ul>').addClass('debug_messages_menu').addClass('clearfix');
		listDiv.append(debugMessagesMenu);
		
		//building top menu
		var messageTypes = ['error', 'warning', 'notice', 'debug', 'timing'];
		for(index in messageTypes) {
			var messageType = messageTypes[index];
			
			var menuCheckbox = $('<input>').attr('type', 'checkbox').attr('id', 'message_filter_' + messageType).val(messageType);
			var menuLabel = $('<label>').attr('for', 'message_filter_' + messageType).text(messageType + ' (' + that.count(messageType) + ')');
			
			if(config.hasOwnProperty(messageType + 'MessageVisible') && config[messageType + 'MessageVisible']) {
				menuCheckbox.attr('checked', 'checked');
			}
			
			menuCheckbox.change(function(){
				if(config.hasOwnProperty('onFilterChange') && typeof config.onFilterChange == 'function') {
					config.onFilterChange($(this));
				}
				
				that.filterMessages();
			});
			var menuLi = $('<li>').append(menuCheckbox).append(' ').append(menuLabel);
			
			debugMessagesMenu.append(menuLi);
		}
		
		//building list of messages
		var debugMessages = $('<ul>').addClass('debug_messages');
		listDiv.append(debugMessages);

		var showHideAnim = function(message) {
			if(!message.is('.full')) {
					message.addClass('full');
					message.stop().find('.debug_message_content').hide().slideDown('fast');
				} else {
					message.stop().find('.debug_message_content').slideUp('fast', function() {
						message.removeClass('full');
						$(this).css('display', 'inline');
					});
				}
			};
		
		for(index in messages) {
			var message = messages[index];
			var messageTitle = $('<span>').addClass('debug_message_label').text(message.title + ' ').click(function(event){
				showHideAnim($(this).parent());
				event.stopPropagation();
			});
			var messageContent = $('<div>').addClass('debug_message_content').html(message.content);
			var messageBody = $('<li>').addClass(message.class).append(messageTitle).append(messageContent).click(function(){
				if(!$(this).is('.full')) {
					showHideAnim($(this));
				}
			});
			
			if( message.isNew ) {
				messageBody.addClass('is_new');
			}
			
			debugMessages.append(messageBody);
		}
		
		that.filterMessages();
		
		return listDiv;
	}
}