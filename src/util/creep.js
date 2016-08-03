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
};

Creep.prototype.transferAnyResourceType = function(target) {
	for(var k in this.carry){
		var amount = this.carry[k];
		if(amount > 0){
			return this.transfer(target, k);
		}
	}
	return ERR_NOT_ENOUGH_RESOURCES;
};

module.exports = module;