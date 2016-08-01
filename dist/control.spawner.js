var roleHarvester = require("role.harvester");
var roleBuilder = require("role.builder");
var roleWarrior = require("role.warrior");
var roleUpgrader = require("role.upgrader");
var roleRepairman = require("role.upgrader");
var roleClaimnant = require("role.claimnant");
var roleRoadbuilder = require("role.roadbuilder");
var roleCarrier = require('role.carrier');
var rolesUtil = require("util.roles")

module.exports = {
    run: function(room, isReservation, parent) {
        
        var desiredHarvesters = roleHarvester.getDesired(room);
        var desiredBuilders = isReservation ? 0 : 1;
        var desiredUpgraders = isReservation ? 0 : 1;
        var desiredCarriers = isReservation ? 1 : 2;
        var desiredWarriors = isReservation ? 1 : 0;
        var desiredRepairmen = isReservation ? 0 : 0;
        var desiredClaimnants = isReservation ? 2 : 0;//Note: The are CLAIM body parts, not claimnants
        var desiredRoadbuilders = isReservation ? 1 : 0;
        
        if(room.energyCapacityAvailable == room.energyAvailable && Math.floor(0.5 + Math.random()*99 == 0)){
            //desiredBuilders++;
        }
        
        if(room.storage && room.storage.store.energy > 10000){
            desiredBuilders++;
        }
        if(room.storage && room.storage.store.energy > 30000){
            desiredBuilders++;
        }
        if(room.storage && room.storage.store.energy > 60000){
            desiredBuilders++;
        }
        if(room.storage && room.storage.store.energy > 80000){
            desiredBuilders++;
        }
        if(room.controller.level === 2){
            desiredBuilders++;
        }
        
        if(!isReservation && room.find(FIND_STRUCTURES, {
            filter:function(struct) {
                return struct.structureType == STRUCTURE_ROAD || struct.structureType == STRUCTURE_RAMPART
            }
        }).length > 0){
            desiredRepairmen++;
        }
        
        var spawnRoom = isReservation ? parent : room;
        var spawners = spawnRoom.find(FIND_MY_SPAWNS, {
            filter: function(spawn){
                return !spawn.spawning;
            }
        })
        if(spawners.length == 0){
            return;
        }
        var spawn = spawners[0]
        
        //console.log(desiredHarvesters+":"+isReservation);
        var builders = 0;
        var harvesters = 0;
        var upgraders = 0;
        var carriers = 0;
        var warriors = 0;
        var claimnants = 0;
        var repairmen = 0;
        var roadbuilders = 0;
        
        //Handle reservation claimnants
        if(isReservation){
            //desiredClaimnants = parent.energyCapacityAvailable >= 1350 ? 1 : 2;
            
            //Now count the CLAIM modules we have in use
            for(var name in Game.creeps){
                if(Game.creeps[name].memory.home == room.name){
                    var body = Game.creeps[name].body;
                    for(var i  in body){
                        if(body[i].type == CLAIM){
                            
                            claimnants = claimnants + 1;
                        }
                    }
                }
            }
        }
        
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            
            if(creep.memory.home == room.name){
                if (creep.memory.role == 'harvester') {
                    harvesters++;
                } else if (creep.memory.role == 'upgrader') {
                    upgraders++;
                } else if (creep.memory.role == 'builder') {
                    builders++;
                }else if (creep.memory.role == 'carrier') {
                    carriers++;
                }else if (creep.memory.role == 'warrior') {
                    warriors++;
                }else if (creep.memory.role == 'repairman') {
                    repairmen++;
                }else if (creep.memory.role == 'roadbuilder') {
                    roadbuilders++;
                }
            }
        }
        room.memory.harvesters = harvesters;
        //console.log("Harvesters: "+harvesters)
        
        console.log(room+":"+claimnants+"/"+desiredClaimnants);
        
        //console.log(builders+":"+harvesters+":"+upgraders)
        
        //desiredCarriers = Math.ceil((desiredHarvesters/3)*1.4);
        //console.log(roleBuilder.getDesign(this.getBudget(room)))
        //console.log(roleWarrior.getDesign(this.getBudget(room)));
        
        var budget = spawn.room.find(FIND_MY_CREEPS).length == 0 || harvesters == 0 ? Math.max(300, spawn.room.energyAvailable) : spawn.room.energyCapacityAvailable;
        
        //Spawn more creeps if needed
        if (desiredHarvesters > harvesters){
            spawn.createCreep(roleHarvester.getDesign(budget), undefined,       {role: 'harvester', home: room.name});
        } else if (desiredCarriers > carriers){
            spawn.createCreep(roleCarrier.getDesign(budget), undefined,         {role: 'carrier', home: room.name});
        } else if (desiredBuilders > builders){
            spawn.createCreep(roleBuilder.getDesign(budget), undefined,         {role: 'builder', home: room.name});
        } else if (desiredUpgraders > upgraders){
            spawn.createCreep(roleUpgrader.getDesign(budget), undefined,        {role: 'upgrader', home: room.name});
        } else if (desiredClaimnants > claimnants){
            spawn.createCreep(roleClaimnant.getDesign(budget), undefined,       {role: 'claimnant', home: room.name});
        } else if (desiredWarriors > warriors){
            spawn.createCreep(roleWarrior.getDesign(budget), undefined,         {role: 'warrior', home: room.name});
        } else if (desiredRepairmen > repairmen){
            spawn.createCreep(roleRepairman.getDesign(budget), undefined,       {role: 'repairman', home: room.name});
        }else if (desiredRoadbuilders > roadbuilders){
            spawn.createCreep(roleRoadbuilder.getDesign(budget), undefined,     {role: 'roadbuilder', home: room.name});
        }
    },
    
    getBudget: function(room){
        var budget = 0;
        var spawns = room.find(FIND_MY_SPAWNS);
        var exts = room.find(FIND_MY_STRUCTURES, {
            filter: function(structure){
                return structure.structureType == STRUCTURE_EXTENSION;
            }
        });
        
        if(spawns.length){
            budget = budget + spawns.length * spawns[0].energyCapacity;
        }
        if(exts.length){
            budget = budget + exts.length * exts[0].energyCapacity;
        }
        
        return budget;
    },

    spawnRole: function(spawn, roleName, mem, budget){
        if(!mem){
            mem = {};
        }
        if(!mem.home){
            mem.home = spawn.room.name;
        }
        mem.role = roleName;
        var role = rolesUtil[roleName];
        return spawn.createCreep(role.getDesign(budget), undefined, mem);
    }
};