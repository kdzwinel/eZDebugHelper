function QueryMessage(config) {
	var parts = config.title.match(/\(([0-9]+) rows, ([0-9.]+) ms\) query number per page:([0-9]+)$/);

	this.title = 'DB query #'+parts[3]+' ('+parts[1]+' rows, '+parts[2]+' ms)';
	this.query_number = parts[3];
	this.query_rows = parts[1];
	this.query_time = parts[2];
	this.type = 'dbquery';
	this.time = config.time;
	this.content = config.content;
}

QueryMessage.prototype.render = function() {
	return '<pre class="sql">' + this.content + '</pre>';
}

QueryMessage.prototype.equals = function(otherMessage) {
	return otherMessage.content == this.content &&
		otherMessage.query_rows == this.query_rows &&
		otherMessage.type == this.type;
}

QueryMessage.prototype.onShow = function(domElement) {
	//calls SyntaxHighlighter to render SQL (does it only once)
	var prettyprintPre = domElement.find('pre.sql');

	if(prettyprintPre.length) {
		console.log('formatt sql')

		SyntaxHighlighter.highlight({
			brush: 'sql',
			toolbar: false,
			"auto-links": false
		}, prettyprintPre[0]);
	}
}