function MessagesList() {
	var messages = []
	var listDiv;
	var that = this;
	
	this.process = function(tableRows) {
		messages = [];
		var messageFactory = new MessageFactory();
		
		tableRows.each(function(i,item){
			if(i%2 != 0) {
				return;
			}
			
			var header = $(this);
			var content = $(this).next();
			
			var message = messageFactory.createMessage({
				type: header.attr('class'),
				title: header.find('.debugheader:eq(0)').text(),
				time: header.find('.debugheader:eq(1)').text(),
				content: content.find('td pre').html()
			});
			
			messages.push(message);
		});
	}
	
	this.getMessages = function() {
		return messages;
	}
	
	this.setMessages = function(newMessages) {
		var messageFactory = new MessageFactory();
		messages = messageFactory.classify(newMessages);
	}
	
	this.count = function(type) {
		var count = 0;
		
		for(index in messages) {
			var message = messages[index];
			
			if(type == undefined || type == message.type) {
				count++;
			}
		}
		
		return count;
	}
	
	/**
	* Manages messages visibility basing on filter settings
	*
	* @param {boolean} onlyHide all 'show' operations will be ignored, used to imporve performance
	*/ 
	this.filterMessages = function(onlyHide) {
		if(listDiv == undefined) {
			return false;
		}
		onlyHide = onlyHide ? onlyHide : false;
		
		var messageList = listDiv.find('.debug_messages');
		var checkboxes = listDiv.find('.debug_messages_menu input[type=checkbox]');
		
		$(checkboxes).each(function(i,item) {
			var checkbox = $(item);
			var messageType = checkbox.val();
			
			if(checkbox.is(':checked')) {
				if(!onlyHide) {
					messageList.find('li.' + messageType).show();
				}
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
				
				if(oldMessage.type == message.type && oldMessage.equals(message)) {
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
		var messageTypes = ['error', 'warning', 'notice', 'debug', 'timing', 'dbquery'];

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

		var showHideAnim = function(message) {
			if(!message.is('.full')) {
					message.addClass('full');

					/* Don't animate long messages */
					if(message.text().length < 10000) {
						message.stop().find('.debug_message_content').hide().slideDown('fast');
					}
			} else {
				message.stop().find('.debug_message_content').slideUp('fast', function() {
					message.removeClass('full');
					$(this).css('display', 'inline');
				});
			}
		};

		//building message list using raw HTML to speed things up
		var messagesHTML = "<ul class='debug_messages'>";
		for(index in messages) {
			var message = messages[index];

			var messageContent = "<span class='debug_message_label'>" + message.title + " </span><div class='debug_message_content'>" + message.render() + "</div>";
			var messageWrapper = "<li class='" + message.type + (message.isNew?" is_new":"") + "' data-index='" + index + "'>" + messageContent + "</li>";

			messagesHTML += messageWrapper;
		}
		messagesHTML += "</ul>"
		listDiv.append(messagesHTML);

		listDiv.find('ul.debug_messages > li').click(function(){
				var idx = $(this).data('index');
				var message = messages[idx];

				if(message && typeof(message.onShow) == "function") {
					message.onShow( $(this) );
				}

				if(!$(this).is('.full')) {
					showHideAnim($(this));
				}
			}).find('span.debug_message_label').click(function(){
				if($(this).parent().is('.full')) {
					showHideAnim($(this).parent());
					event.stopPropagation();
				}
			});
		
		that.filterMessages(true);
		
		return listDiv;
	}
}