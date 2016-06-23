var roleRepairman = require("role.repairman");

module.exports = {
    
    run: function(creep){
        if(creep.memory.isGathering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.isGathering = false;
	    }
	    if(!creep.memory.isGathering && creep.carry.energy == 0) {
	        creep.memory.isGathering = true;
	        creep.memory.isCarrying = false;
	    }
	    
	    if(creep.memory.isCarrying){
	        roleRepairman.run(creep, true);
	        return;
	    }
	    
	    var room = Game.rooms[creep.memory.home];
        if(!room || room.name != creep.room.name){
            console.log(creep.name+" could not find it's home room: "+creep.memory.home);
            creep.moveTo(new RoomPosition(25, 25, creep.memory.home));
            return;
        }
	    
	    if(!creep.memory.isGathering) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
	            filter: function(site){
	                return site.structureType == STRUCTURE_ROAD;
	            }
	        });
	        
            if(targets.length) {
                var target = targets[Math.floor(Math.random()*targets.length)];
                var code = creep.build(target);
                //console.log(code)
                if(code == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                //No roads to work on, start repairing instead
                creep.memory.isCarrying = true;
                roleRepairman.run(creep, true);
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_DROPPED_ENERGY);
	        //creep.say(sources.length)
            if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
	    }
    },
    
    getDesign: function(budget){
	    var design = [MOVE, CARRY, CARRY, WORK];
	    var spent = 250;
	    
	    budget = Math.min(600, budget)
	    
	    //Add as many WORK, CARRY and MOVE as we can
	    while(spent + 50 <= budget){
	        design[design.length] = CARRY;
	        spent = spent + 50;
	        
	        if(spent + 50 > budget){
	            return design;
	        }
	        design[design.length] = MOVE;
	        spent = spent + 50;
	        
	        if(spent + 50 > budget){
	            return design;
	        }
	        design[design.length] = MOVE;
	        spent = spent + 50;
	        
	        if(spent + 100 > budget){
	            return design;
	        }
	        design[design.length] = WORK;
	        spent = spent + 100;
	    }
	    
	    return design;
	}
};