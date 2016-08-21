var inv = require("control.inventory");

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var reservee = null;
        try{
            reservee = Game.rooms[Game.rooms[creep.memory.home].memory.reservee];
        } catch(_){}
        var room = Game.rooms[creep.memory.home];
        if(!room){
            console.log(creep.name+" could not find it's home room: "+creep.memory.home);
            creep.moveTo(new RoomPosition(25, 25, creep.memory.home));
            return;
        }
        var target = inv.getMiningSource(room, creep);
        
        if(!target){
            creep.moveTo(25, 25, room);
            creep.say("Target?")
            return;
        }
        var isPrimitive = reservee == null && creep.room.find(FIND_MY_CREEPS, {
        	filter: function(c){
        		return c.memory.home == creep.memory.home;
        	}
        }).length <= this.getDesired(creep.room);
        
        if(creep.carry.energy < creep.carryCapacity) {

            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else if(creep.isOnChokepoint()) {
                creep.move(Math.floor(Math.random() * 8));
            }

            //creep.say("Harvesting")
        }else{
            if(isPrimitive){
                //Primitive means that we are required to drop energy at the spawn
                creep.say("Primitive")
                var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: function(structure){
                        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION)  && structure.energy < structure.energyCapacity;
                    }
                });
                if(target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } 
            } else {
                creep.drop(RESOURCE_ENERGY, creep.carry.energy);
            }
        }
        
	},
	
	getDesign: function(budget, room){
	    var design = [MOVE, CARRY, WORK];
	    var spent = 200;
	    
        //If any of our sources are partly blocked, we need more WORK
        //TODO: Handle when two sources are partly blocked
        var minimum = 550;
        if(room && room.memory && room.memory.minerSlots && room.memory.minerSlots % 2 === 1){
            minimum = minimum + 300;
        }

	    budget = Math.min(budget, minimum);
	    
	    //Add as many WORK as we can
	    while(spent + 100 <= budget){
	        design[design.length] = WORK;
	        spent = spent + 100;
	    }
	    
	    if(budget == spent + 50){
	        design[design.length] = MOVE;
	        spent = spent + 50;
	    }
	    
	    //console.log(spent + design + budget)
	    
	    return design;
	},
	
	getDesired: function(room) {
	    //if(room.memory.minerSlots == null){
	        room.memory.minerSlots = 0;
	        var sources = room.find(FIND_SOURCES, {
                filter: function(object) {
                    //Filter out sources near enemies
                    return object.pos.findInRange(FIND_HOSTILE_STRUCTURES, 20, {
                        filter: function(struct) {return struct.structureType != STRUCTURE_CONTROLLER}
                    }).length == 0;
                }});
	        for(var i in sources){
	            var src = sources[i];
	            
	            room.memory.minerSlots = room.memory.minerSlots + src.getSlots();
	        }
	    //}
	    
	    return room.memory.minerSlots;
	}
};

module.exports = roleHarvester;