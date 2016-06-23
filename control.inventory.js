Source.prototype.getSlots = function(){
	var slots = 0;
    slots = this.room.lookForAt(LOOK_TERRAIN, this.pos.x-1, this.pos.y+1)[0] == "wall" ? slots : slots + 1;
	slots = this.room.lookForAt(LOOK_TERRAIN, this.pos.x,   this.pos.y+1)[0] == "wall" ? slots : slots + 1;
	slots = this.room.lookForAt(LOOK_TERRAIN, this.pos.x+1, this.pos.y+1)[0] == "wall" ? slots : slots + 1;
	slots = this.room.lookForAt(LOOK_TERRAIN, this.pos.x+1, this.pos.y)[0] == "wall" ? slots : slots + 1;
	slots = this.room.lookForAt(LOOK_TERRAIN, this.pos.x+1, this.pos.y-1)[0] == "wall" ? slots : slots + 1;
	slots = this.room.lookForAt(LOOK_TERRAIN, this.pos.x,   this.pos.y-1)[0] == "wall" ? slots : slots + 1;
	slots = this.room.lookForAt(LOOK_TERRAIN, this.pos.x-1, this.pos.y-1)[0] == "wall" ? slots : slots + 1;
	slots = this.room.lookForAt(LOOK_TERRAIN, this.pos.x-1, this.pos.y)[0] == "wall" ? slots : slots + 1;

    slots = Math.min(slots, 2);

    //console.log("Slots: "+slots);

	return slots;
};

module.exports = {
    //Assigns the miner (creep) to the nearest available source.
    getMiningSource: function(room, creep) {
        //console.log("Source requested!");
        
        //console.log("Found sources: "+sources.length + " Recorded: "+room.memory.sources.length);
        
        if(!room.memory.sources){
            var sources = room.find(FIND_SOURCES, {
                filter: function(object) {
                    //Filter out sources near enemies
                    return object.pos.findInRange(FIND_HOSTILE_STRUCTURES, 20).length == 0;
                }});
            
            console.log("No records found of sources in "+room.name+ ", initializing!");
            room.memory.sources = {};
            
            for(var i in sources){
                var src = sources[i];
                console.log("Found a source with " + src.getSlots() + " slots.")
                room.memory.sources[src.id] = {
                    miners: [],
                    slots: src.getSlots()
                };
            }
        }
        
        var miners = room.memory.sources[creep.memory.source];
        if(miners){
            miners = miners.miners
        }
        if(creep.memory.source == null || (!miners || miners.indexOf(creep.name) == -1)){
            var pos = new RoomPosition(creep.pos.x, creep.pos.y, room.name)
            
            var best = pos.findClosestByRange(FIND_SOURCES, {
                filter: function(object) {
                    var mem = room.memory.sources[object.id];
                    if(!mem){
                        return false;//In case we ignored this because of enemy structures
                    }
                    return mem.slots > mem.miners.length;
                }});
            if(best == null){console.log("Warn: no source found near " + pos); Memory.minerAssignmentFails = Memory.minerAssignmentFails + 1; return;}
            var mem = room.memory.sources[best.id];
            mem.miners[mem.miners.length] = creep.name;
            creep.memory.source = best.id;
            console.log(creep.name + " from "+creep.memory.home+" has been assigned to mine source " + best.id + " in room "+best.room.name);
        }
        
        //creep.say(miners.indexOf(creep.name))
        
        return Game.getObjectById(creep.memory.source);
    }
};