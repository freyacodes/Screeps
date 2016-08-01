module.exports = {
    getNextVacancy: function(room){
        var structs = room.find(FIND_MY_STRUCTURES, {
                filter: function(structure){
                    return structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION;
                }
            });
        
        if(structs.length == 0){
            return;
        }
        
        //100 attempts
        for (i = 0; i < 50; i++) {
            var rand = structs[Math.floor(Math.random()*structs.length)];
            
            var xPlus = Math.floor(Math.random()*2) == 0;
            var yPlus = Math.floor(Math.random()*2) == 0;
            
            var x = xPlus ? rand.pos.x + 1 : rand.pos.x - 1;
            var y = yPlus ? rand.pos.y + 1 : rand.pos.y - 1;
            
            var pos = room.getPositionAt(x, y);
            
            //console.log(pos.lookFor(LOOK_STRUCTURES)+":"+pos.lookFor(LOOK_CONSTRUCTION_SITES) +":"+ pos.lookFor(LOOK_TERRAIN))
            
            if(pos.lookFor(LOOK_STRUCTURES).length == 0 && pos.lookFor(LOOK_CONSTRUCTION_SITES).length == 0 && pos.lookFor(LOOK_TERRAIN) != "wall" && pos.lookFor(LOOK_CREEPS).length == 0){
                return pos;
            }
        }
        
        console.log("Failed to find structure placement after 50 attempts at "+room.name);
    },
    
    runExtentionBuilder: function(room){
        if(!room.memory.currentExtentionSite || room.getPositionAt(room.memory.currentExtentionSite.x, room.memory.currentExtentionSite.y).lookFor(LOOK_CONSTRUCTION_SITES).length == 0){
            var pos = this.getNextVacancy(room);
            if(pos){
                var code = pos.createConstructionSite(STRUCTURE_EXTENSION);
                if(code == 0){
                    console.log("New extention being built at "+pos);
                    room.memory.currentExtentionSite = pos;
                } else {
                    room.memory.currentExtentionSite = null;
                }
            }
        }
    }
};