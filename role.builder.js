var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.isGathering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.isGathering = false;
	    }
	    if(!creep.memory.isGathering && creep.carry.energy == 0) {
	        creep.memory.isGathering = true;
	    }

	    if(!creep.memory.isGathering) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                var target = targets[Math.floor(Math.random()*targets.length)];
                var code = creep.build(target);
                //console.log(code)
                if(code == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                //Whatever, let's work like we are an upgrader
                roleUpgrader.run(creep, true);
            }
        }
        else {
            if(creep.room.storage && creep.room.storage.store.energy > 2000){
                if(creep.room.storage.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage);
                }
            } else {
                var sources = creep.room.find(FIND_DROPPED_ENERGY);
                //creep.say(sources.length)
                if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
	        }
	    }
	},
	
	getDesign: function(budget){
	    var design = [MOVE, CARRY, CARRY, WORK];
	    var spent = 250;
	    
	    var budget = Math.min(1000, budget)
	    
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

module.exports = roleBuilder;