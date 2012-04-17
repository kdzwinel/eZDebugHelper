function Settings(keyName) {
	var that = this;
	
	this.load = function() {
		var json = localStorage[keyName];
		if(localStorage[keyName] != undefined) {
			return JSON.parse(json);
		}
		
		return {};
	}
	
	this.update = function(settings) {
		localStorage[keyName] = JSON.stringify(settings);
	}
  
	this.get = function(key, defaultValue) {
		var settings = that.load();
		 
		if(settings[key] != undefined) {
			return settings[key];
		}
		
		return defaultValue;
	}
	
	this.set = function(key, value) {
		var settings = that.load();
		
		settings[key] = value;
		
		that.update(settings);
	}
}