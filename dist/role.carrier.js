module.exports = {

    /** @param {Creep} creep **/
    run: function(creep, isDefaulting) {
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
        
        if(!isDefaulting){
            if(creep.memory.isGathering && creep.carry.energy == creep.carryCapacity){
                creep.memory.isGathering = false;
            } else if (creep.carry.energy == 0){
                creep.memory.isGathering = true;
            }
        }
        
	    if(creep.memory.isGathering) {
	        if(reservee && creep.room.name != room.name){
	            creep.moveTo(new RoomPosition(25, 25, room.name));
	            return;
	        } else if(room){
                var sources = room.find(FIND_DROPPED_ENERGY);
                if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
	        }
        } else {
            //Drop the energy off somewhere
            if(creep.memory.isGathering && reservee && creep.room.name != reservee.name){
                creep.moveTo(25, 25, reservee);
            } else {
                var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: function(structure){
                        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION  || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                        //return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
                    }
                });
                if(!target && reservee){
                    var targets = reservee.find(FIND_MY_STRUCTURES, {
                        filter: function(structure){
                            return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION  || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                        }
                    });
                    target = targets[0]
                }
                
                if(target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else if(creep.room.storage){
                    if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage);
                    }
                } else {
                    //creep.moveTo(Game.flags.Idle);
                    
                    if(creep.pos.getRangeTo(Game.flags.Idle) < 4){
                        creep.drop(RESOURCE_ENERGY, creep.carry.energy);
                    }
                }
            }
        }
	},
	
	getDesign: function(budget){
	    var design = [];
	    var spent = 0;
	    
	    budget = Math.min(1800, budget)
	    
	    //Add as many CARRY and MOVE as we can
	    while(spent + 150 <= budget){
	        design[design.length] = MOVE
	        design[design.length] = CARRY
	        design[design.length] = CARRY
	        spent = spent + 150
	    }
	    
	    return design
	}
};