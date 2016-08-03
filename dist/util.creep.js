module = {};

Creep.prototype.getNumberOfParts = function(type) {
	var count = 0;
    for(var i in this.body){
    	var part = this.body[i];
    	if(part.type == type){
    		count++;
    	}
    }
    return count;
}

module.exports = module;