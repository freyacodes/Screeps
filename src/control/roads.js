module.exports = {

    run: function(room){
        var startCPU = Game.cpu.getUsed();

        if(!room || !room.controller || !room.controller.my || room.controller.level <= 4){
            return;
        }

        if(Game.cpu.tickLimit < 400){
            return;
        }

        var startPoint = room.find(FIND_MY_SPAWNS)[0].pos;
        var endPoints = [
            room.controller.pos
        ];

        var sources = room.find(FIND_SOURCES);
        for(var i in sources){
            var source = sources[i];
            endPoints[endPoints.length] = source.pos;
        }

        var endPoint = endPoints[Math.floor((Math.random() * endPoints.length))];

        var path = PathFinder.search(startPoint, endPoint, {
            roomCallback: this.createRoadsCostMatrix,
            plainCost: 2,
            swampCost: 9,
            maxRooms: 1
        });

        var positions = path.path;
        for(var i in positions){
            var pos = positions[i];

            var isPositionInvalid = false;
            var tileContents = pos.look();
            for(var i in tileContents){
                if(tileContents.type == "structure" || tileContents.type == "constructionSite"){
                    isPositionInvalid = true;
                    continue;
                }
            }

            if(!isPositionInvalid){
                pos.createFlag("Site_"+STRUCTURE_ROAD+"_"+pos);
            }
        }

        console.log("Constructed road with a length of " + positions.length);

        var cpuUsage = Game.cpu.getUsed() - startCPU;
    },

    createRoadsCostMatrix: function(roomName){
        var room = Game.rooms[roomName];

        var spawnX = 25;
        var spawnY = 25;

        if(spawn) {
            var spawn = room.find(FIND_MY_SPAWNS)[0];

            spawnX = spawn.pos.x;
            spawnY = spawn.pos.y;
        }

        var costs = new PathFinder.CostMatrix;
        var data = room.lookAtArea(0, 0, 49, 49);

        for (x = 0; x < 50; x++) {
            for (y = 0; y < 50; y++) {
                var tData = data[y][x];

                var structure = module.exports.getTypeFromData(tData, "structure");

                if(structure && structure.structureType == STRUCTURE_ROAD){
                    costs.set(x, y, 1);
                    continue;
                }

                if(structure && structure.structureType != STRUCTURE_RAMPART){
                    costs.set(x, y, 30);//Somewhere we cannot walk
                    continue;
                }

                var terrain = module.exports.getTypeFromData(tData, "terrain");

                if(terrain == "wall"){
                    costs.set(x, y, 30);//Somewhere we cannot walk
                    continue;
                }

                var site = module.exports.getTypeFromData(tData, "constructionSite");

                if(site){
                    if(site.structureType == STRUCTURE_ROAD){
                        costs.set(x, y, 1);
                    } else {
                        costs.set(x, y, 15);
                    }
                    continue;
                }

                //Try to enforce a checkered system in relation to the first spawn
                if(Math.abs((spawnX - x) % 2 + (spawnY - y) % 2) != 1){
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
                    }else{
                        color = COLOR_RED;
                    }
                    var pos = room.getPositionAt(x,y);
                    pos.createFlag("Debug_"+cost+"_"+x+","+y, color);
                }
            }
        }
    }
};