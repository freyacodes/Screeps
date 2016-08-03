module = {};

Room.prototype.getDroppedEnergyTotal = function() {
	var count = 0;
	var drops = this.find(FIND_DROPPED_ENERGY);
    for(var i in drops){
    	var drop = drops[i];
    	count = count + drop.amount;
    }
    return count;
}

Room.prototype.getDroppedResourcesTotal = function() {
	var count = 0;
	var drops = this.find(FIND_DROPPED_RESOURCES);
    for(var i in drops){
    	var drop = drops[i];
    	count = count + drop.amount;
    }
    return count;
}

module.exports = module;