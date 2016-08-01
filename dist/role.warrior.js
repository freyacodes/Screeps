var filter = {
    filter: function(structure) {
        return structure.structureType != STRUCTURE_CONTROLLER &&
        structure.structureType != STRUCTURE_POWER_BANK &&
        structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_SPAWN;
    }
};

var filterTowersOnly = {
    filter: function(structure) {
        return structure.structureType == STRUCTURE_TOWER && filter.filter(structure);
    }
};

module.exports = {
    run: function(creep){
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: function(enemy) {
                for(var part in enemy.body){
                    if(part.type == ATTACK || part.type == RANGED_ATTACK || part.type == HEAL){
                        return true;
                    }
                }
                return false;
            }
        });
        //creep.say(target)
        if(target){
            if(creep.attack(target) != OK){
                creep.moveTo(target);
                //console.log(target.pos)
                if(!creep.room.controller || !creep.room.controller.my){
                    var walls = creep.pos.findInRange(FIND_STRUCTURES, 1, 
                        {
                            filter:function(obj) {
                                return obj.constructionType == STRUCTURE_WALL;
                        }});
                    walls = walls.sort(function(a,b){return a.hits-b.hits;})
                    //creep.say(walls[0].hits-walls[1].hits)
                    if( walls ) {
                        creep.attack(walls[0]);
                        //creep.say(creep.attack(walls[0]))
                    }
                }
                return;
            } else {
                console.log(creep.name + " is attacking: " + creep.hits+"/"+creep.hitsMax + " vs " + target.hits+"/"+target.hitsMax);
            }
        } else if (creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, filter)){
            var filterToUse = creep.room.find(FIND_HOSTILE_STRUCTURES, filterTowersOnly).length > 0 ? filterTowersOnly : filter;
            
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, filterToUse);
            if(target){
                if(creep.attack(target) == ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            }
        } else {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target){
                //These targets are specifically enemies WITHOUT any warfare body parts.
                if(creep.attack(target) == ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            } else {
                var flag;
                if(Game.flags.Warriors){
                    flag = Game.flags.Warriors;
                } else {
                    flag = Game.flags["Rally_"+creep.memory.home];
                    if(!flag && Game.rooms[creep.memory.home]){
                        new RoomPosition(25, 25, creep.memory.home).createFlag("Rally_"+creep.memory.home, COLOR_RED)
                        flag = Game.flags["Rally_"+creep.memory.home];
                    } else if (!flag) {
                        creep.say("Remote room")
                        creep.moveTo(new RoomPosition(25, 25, creep.memory.home))
                    }
                }
                
                if(flag && !creep.pos.isEqualTo(flag.pos)){
                    creep.moveTo(flag);
                    //console.log(flag.pos)
                }
            }
        }
        
    },
    
    getDesign: function(budget){
	    var design = [MOVE, ATTACK, ATTACK];
	    var spent = 230;
	    
	    budget = Math.max(750);
	    
	    //Add as many ATTACK, TOUGH and MOVE as we can
	    while(spent + 50 <= budget){
	        design[design.length] = MOVE;
	        spent = spent + 50;
	        
	        if(spent + 80 > budget){
	            return design;
	        }
	        design[design.length] = ATTACK;
	        spent = spent + 80;
	        
	        if(spent + 50 > budget){
	            return design;
	        }
	        design[design.length] = MOVE;
	        spent = spent + 50;
	        
	        if(spent + 80 > budget){
	            return design;
	        }
	        design[design.length] = ATTACK;
	        spent = spent + 80;
	        
	        if(spent + 10 > budget){
	            return design;
	        }
	        design[design.length] = TOUGH;
	        spent = spent + 10;
	    }
	    
	    return design;
	}
};