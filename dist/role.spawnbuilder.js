//Game.spawns.Spawn1.createCreep([MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY], undefined, {role:"spawnbuilder",home:"E17S23"})

module.exports = {
    run: function(creep){
        //First navigate to the room
        //creep.say(creep.memory.home)
        var room = Game.rooms[creep.memory.home];
        if(!room || creep.room.name != creep.memory.home){
            //console.log(creep.name+" could not find it's home room: "+creep.memory.home);
            creep.moveTo(new RoomPosition(25, 25, creep.memory.home));
            return;
        }
        
        //Continue if we are already in the room
        
        if(!room.controller.my){
            if(creep.claimController(room.controller) == ERR_NOT_IN_RANGE){
                creep.moveTo(room.controller.pos);
            }
        }
        
        
        if(creep.memory.isGathering && creep.carry.energy == creep.carryCapacity){
            creep.memory.isGathering = false;
        } else if (creep.carry.energy == 0){
            creep.memory.isGathering = true;
        }
        
        if(creep.memory.isGathering){
            var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            if(target){
                if(creep.pickup(target) != OK){
                    creep.moveTo(target)
                }
            } else {
                target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                return;
            }
        } else {
            var target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {
                filter: function(site) {
                    return site.structureType == STRUCTURE_SPAWN;
                }
            })
            if(target){
                if(creep.build(target) == ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            } else {
                if(room.find(FIND_MY_SPAWNS).length != 0){
                    //Our job is done. Change role to harvester
                    creep.memory.role = "harvester"
                }
            }
        }
    }
};