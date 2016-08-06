module.exports = {
    createRoadsCostMatrix: function(roomName){
        var room = Game.rooms[roomName];
        var spawn = room.find(FIND_MY_SPAWNS);

        var spawnX = spawn.x;
        var spawnY = spawn.y;

        var costs = new PathFinder.CostMatrix;
        var data = room.lookAtArea(0, 0, 49, 49);

        for (x = 0; x < 50; x++) {
            for (y = 0; y < 50; y++) {
                var tData = data[x][y];

                var structure = getTypeFromData(tData, "structure");

                if(structure && structure.structureType == STRUCTURE_ROAD){
                    costs.set(x, y, 1);
                    continue;
                }

                if(structure && structure.structureType != STRUCTURE_RAMPART){
                    costs.set(x, y, 20);//Somewhere we cannot walk
                    continue;
                }

                var site = getTypeFromData(tData, "constructionSite");

                if(site){
                    if(site.structureType == STRUCTURE_ROAD){
                        costs.set(x, y, 1);
                    } else {
                        costs.set(x, y, 20);
                    }
                    continue;
                }

                //Try to enforce a checkered system in relation to the first spawn
                if(Math.abs((spawnX + x) % 2 + (spawnY + y) % 2) != 1){
                    //This goes against the guideline
                    costs.set(x, y, 7);
                }//Else just 0
            }
        }

        return costs;
    },

    getTypeFromData: function(data, type){
        for(var i in data){
            if(data[i].type == type){
                return data[i][type];
            }
        }
    },

    debugCostMatrix: function(room, costs){
        for (x = 0; x < 50; x++) {
            for (y = 0; y < 50; y++) {
                var cost = costs.get(x,y);
                if(cost != 0){
                    var color = null;
                    if(cost === 1){
                        color = COLOR_GREEN;
                    }else if(cost === 7){
                        color = COLOR_YELLOW;
                    }else(cost > 7){
                        color = COLOR_RED;
                    }
                    var pos = room.getPositionAt(x,y);
                    pos.createFlag("Debug_"+x+":"+y, color);
                }
            }
        }
    }
};