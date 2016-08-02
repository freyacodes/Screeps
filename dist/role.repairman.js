module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.isGathering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.isGathering = false;
	    }
	    if(!creep.memory.isGathering && creep.carry.energy == 0) {
            creep.memory.isGathering = true;
            creep.memory.lastTarget = null;
	    }

        if(creep.memory.isCarrying && !creep.memory.isGathering){
            require("role.carrier").run(creep, true)
            return;
        }
        
        var room = Game.rooms[creep.memory.home];
        if(!room){
            console.log(creep.name+" could not find it's home room: "+creep.memory.home);
            creep.moveTo(new RoomPosition(25, 25, creep.memory.home));
            return;
        }

	    if(!creep.memory.isGathering) {
	        if(creep.memory.lastTarget && Game.getObjectById(creep.memory.lastTarget) && Game.getObjectById(creep.memory.lastTarget).hits < Game.getObjectById(creep.memory.lastTarget).hitsMax && creep.memory.ticksRepairing < 15){
	            var target = Game.getObjectById(creep.memory.lastTarget);
	            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                       creep.moveTo(target);
                    } else {
                        creep.memory.ticksRepairing = creep.memory.ticksRepairing + 1;
                    }
	        } else if(room.find(FIND_STRUCTURES).length) {
                var targets = room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax - 1000
                });
                
                targets.sort((a,b) => a.hits - b.hits);
                
                if(targets.length > 0) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);    
                    } else {
                        creep.memory.lastTarget = targets[0].id;
                        creep.memory.ticksRepairing = 1;
                    }
                    
                } else {
                    //Whatever, let's just act like a carrier then
                    creep.memory.isCarrying = true;
                    require("role.carrier").run(creep, true)
                    //creep.moveTo(Game.flags.Idle);
                }
            } else {
                //Whatever, let's just act like a carrier then
                require("role.carrier").run(creep, true)
                //creep.moveTo(Game.flags.Idle);
            }
	    }
	    else {
	        var sources = room.find(FIND_DROPPED_ENERGY);
            if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
	    }
	},
	
	getDesign: function(budget){
	    var design = [MOVE, CARRY, CARRY, WORK];
	    var spent = 250;
	    
	    budget = Math.min(1200, budget)
	    
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
	        design[design.length] = CARRY;
	        spent = spent + 50;
	        
	        if(spent + 100 > budget){
	            return design;
	        }
	        design[design.length] = WORK;
	        spent = spent + 100;

	        if(spent + 50 > budget){
	            return design;
	        }
	        design[design.length] = MOVE;
	        spent = spent + 50;
	    }
	    
	    return design;
	}
};