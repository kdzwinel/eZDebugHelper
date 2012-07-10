function MessageFactory() {
	this.createMessage = function(config) {
		var title = config.hasOwnProperty('title') ? config.title : null;
		
		//For all types of databases debug message is outputed by a common interface (ezdbinterface.php@353) in the same format
		if(title && title.indexOf("::query(") != -1) {
			var parts = title.match(/\(([0-9]+) rows, ([0-9.]+) ms\) query number per page:([0-9]+)$/);
			
			//TODO QueryMessage class?
			return {
				title: 'DB query #'+parts[3]+' ('+parts[1]+' rows, '+parts[2]+' ms)',
				query_number: parts[3],
				query_rows: parts[1],
				query_time: parts[2],
				class: 'dbquery',
				time: config.time,
				content: '<pre class="sql">'+config.content+'</pre>'
			};
		}
		
		//TODO Message class?
		return {
			title: config.title,
			class: config.class,
			time: config.time,
			content: config.content,
			render: function() {
				return config.content;
			}
		};
	}
}