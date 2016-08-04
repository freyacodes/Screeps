var towerStructure = {
	run: function(tower){
		if(tower) {
		    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		    if(closestHostile) {
		        tower.attack(closestHostile);
		    } else {
		        var damagedCreeps = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
		            filter:function(creep) {
		                return creep.hits < creep.hitsMax
		            }
		        });
		        if(damagedCreeps){
		            tower.heal(damagedCreeps)
		        } else {
		            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
		                filter: (structure) => structure.hits < Math.min(10000, structure.hitsMax) && (structure.my || structure.structureType == STRUCTURE_ROAD)
		            });
		            if(closestDamagedStructure) {
		                tower.repair(closestDamagedStructure);
		            }
		        }
		    }
		}
	}
}

module.exports = towerStructure;