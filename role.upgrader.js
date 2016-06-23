var roleUpgrader = {

    run: function(creep, isDefaulting) {
        var room = Game.rooms[creep.memory.home];
        if(!isDefaulting){
            if(creep.memory.isGathering && creep.carry.energy == creep.carryCapacity){
                creep.memory.isGathering = false;
            } else if (creep.carry.energy == 0){
                creep.memory.isGathering = true;
            }
        }
        
	    if(creep.memory.isGathering) {
            var sources = creep.room.find(FIND_DROPPED_ENERGY);
            if(sources[0]){
                if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(sources[0])
                }
            }else{
                creep.moveTo(room.controller);
            }
        }
        else if(room.controller && room.controller.my && room.controller.level > 0){
            var range = creep.pos.getRangeTo(room.controller);
            if(range < 5){
                creep.upgradeController(room.controller)
                if(range > 2){
                    creep.moveTo(room.controller)
                }
            } else {
                creep.moveTo(room.controller)
            }
            /*
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller)
            }*/
        }
	},
	
	getDesign: function(budget){
	    var design = [MOVE, CARRY, CARRY, WORK];
	    var spent = 250;
	    
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
	    }
	    
	    return design;
	}
};

module.exports = roleUpgrader;