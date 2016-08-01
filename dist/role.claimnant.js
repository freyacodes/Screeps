module.exports = {
    run: function(creep){
        var room = Game.rooms[creep.memory.home];
        var home = room;
        /*
        //if(!isDefaulting){
            if(creep.memory.isGathering && creep.carry.energy == creep.carryCapacity){
                creep.memory.isGathering = false;
            } else if (creep.carry.energy == 0){
                creep.memory.isGathering = true;
            }
        //}
        
	    if(creep.memory.isGathering) {
	        if(creep.room.name != home.name){
	            creep.moveTo(new RoomPosition(25, 25, creep.memory.home));
	        } else if(creep.room){
                var sources = room.find(FIND_DROPPED_ENERGY);
                if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
	        }
        } else {*/
        if(!room){
            console.log(creep.name+" could not find it's home room: "+creep.memory.home);
            creep.moveTo(new RoomPosition(25, 25, creep.memory.home));
            return;
        }
        if(room.controller){
            creep.reserveController(room.controller)
            creep.moveTo(room.controller)
        }
        //}
    },
    
    getDesign: function(budget){
        return budget < 1250 ?
            [MOVE, CLAIM] : //650
            [MOVE, CLAIM, CLAIM]//1250
    }
};