var EventEmitter = function(){
	this._events = {};
};
EventEmitter.prototype.on = function(e, fn){
	if(this._events[e]){
		this._events[e].push(fn);
	} else {
		this._events[e] = [fn];
	}
	return this;
};
EventEmitter.prototype.emit = function(e){
	var args = Array.prototype.slice.call(arguments, 1);
	if(this._events[e]){
		for(var i = 0; i < this._events[e].length; i++){
			this._events[e][i].apply(this, args);
		}
	}
};
