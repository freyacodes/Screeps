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

Room.prototype.removeDebugFlags = function(room) {
   var flags = this.lookForAtArea(LOOK_FLAGS, 0, 0, 49, 49, true);
   for(var i in flags){
        var flag = flags[i].flag;
        if(flag.name.startsWith("Debug")){
            flag.remove();
        }
   }
}

module.exports = module;