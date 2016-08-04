var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCarrier = require('role.carrier');
var roleWarrior = require('role.warrior');
var roleRepairman = require('role.repairman');
var roleClaimnant = require("role.claimnant");
var roleRoadbuilder = require("role.roadbuilder");
var roleSpawnbuilder = require("role.spawnbuilder");
var spawner = require("control.spawner");
var inv = require("control.inventory");
var gc = require("control.gc");
var construction = require("control.construction");
var creepUtil = require("util.creep");
var roomUtil = require("util.room");
var towerStructure = require("control.tower");

module.exports.loop = function () {
    PathFinder.use(true);
    
    //Start with gc checks
    if(Memory.creepsLastTick){
        if(Memory.creepsLastTick > Game.creeps.length){
            gc.gcCreep();
        }
    }
    Memory.creepsLastTick = Game.creeps.length;
    
    if(Memory.minerAssignmentFails > 4){
        Memory.minerAssignmentFails = 0;
        gc.gcCreep();
        for(var k in Game.rooms){
            delete Game.rooms[k].memory.sources;
        }
    }

    for(k in Game.rooms){
        var room = Game.rooms[k];
        var towers = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_TOWER
        })
        for(var i in towers){
            try{
                var tower = towers[i];
                towerStructure.run(tower);
            } catch(err){
                console.log("Error occurred when controlling tower in room "+rom+": "+err);
            }
        }
    }

    var cpu = Game.cpu.getUsed();
    var cpuRoles = cpu;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        //creep.memory.role ="harvester"
        //this.renewRequired(creep);
        /*if(creep.memory.renewing){
            this.renewCreep(creep);
        }else */
        try{
            if(false){
                creep.moveTo(Game.flags.Rally);
            }else if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
                delete creep.memory.renewing;
            }else if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
                delete creep.memory.renewing;
            }else if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
                delete creep.memory.renewing;
            }else if(creep.memory.role == 'carrier') {
                roleCarrier.run(creep);
                delete creep.memory.renewing;
            }else if(creep.memory.role == 'warrior') {
                roleWarrior.run(creep);
                delete creep.memory.renewing;
            }else if(creep.memory.role == 'claimnant') {
                roleClaimnant.run(creep);
                delete creep.memory.renewing;
            }else if(creep.memory.role == 'repairman') {
                roleRepairman.run(creep);
                delete creep.memory.renewing;
            }else if(creep.memory.role == 'roadbuilder') {
                //creep.say("Road")
                roleRoadbuilder.run(creep);
                delete creep.memory.renewing;
            } else if (creep.memory.role == "spawnbuilder") {
                roleSpawnbuilder.run(creep)
            }
        } catch(err){
            console.log("Role error for " + creep.memory.role + " " + creep.name + ": "+err);
            Game.notify("Role error for " + creep.memory.role + " " + creep.name + ": "+err);
            creep.say(err);
        }
        //console.log(creep.memory.role + " used " + (Game.cpu.getUsed() - cpu))
        //creep.say(Game.cpu.getUsed() - cpu)
        cpu = Game.cpu.getUsed();
    }
    //console.log("roles CPU: " + (Game.cpu.getUsed() - cpuRoles))
    
    if(Game.time%10==0){
        for(var k in Game.rooms){
            var room = Game.rooms[k]
            if(room.controller && room.controller.my){
                if(room.memory && room.memory.reservations){
                    for(var i in room.memory.reservations){
                        var reservation = Game.rooms[room.memory.reservations[i]]
                        if(reservation){
                            spawner.run(reservation, true, room);
                        } else {
                            try{
                                //We were probably wiped out by invaders. Make sure we respawn after 1500 ticks has gone by since the last one to spawn a harvester
                                var mem = Memory.rooms[room.memory.reservations[i]];
                                if(!mem){
                                    mem = {};
                                }
                                console.log(k+" "+mem.invadersLastDetected)
                                var lastDetected = mem.invadersLastDetected;
                                if(lastDetected == null){
                                    lastDetected = 0;
                                }
                                if(Game.time - lastDetected > 1500){
                                    spawner.spawnRole(room.find(FIND_MY_SPAWNS)[0], "harvester", {home:room.memory.reservations[i]}, room.energyCapacityAvailable);
                                    console.log("Spawned a new harvester in attempt to recover reservation.")
                                }
                            } catch(err){
                                console.log("Error while recovering reservation: " + err)
                            }
                        }
                    }
                }
                
                spawner.run(room);//By spawning last, the parent takes priority
            }
        }
    }
    
    if((Game.time+23)%60==0){
        for(var k in Game.rooms){
            construction.runExtentionBuilder(Game.rooms[k]);
        }
    }

    if(Game.time%40==0){
        for(var k in Game.rooms){
            var room = Game.rooms[k]
            if(room.find(FIND_HOSTILE_CREEPS, {
                filter: function(object) {
                    return object.owner.username == "Invader";
                }
            }).length > 0){
                room.memory.invadersLastDetected = Game.time;
            }
        }
    }
}

module.exports.renewRequired = function(creep){
    var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
    if(!spawn || creep.memory.norepair || spawn.spawning){
        return false;
    }
    if(spawn && creep.ticksToLive < 10){
        var code = spawn.recycleCreep(creep);
        console.log("Was forced to recycle "+creep.name+"! Code: "+code);
        return false;
    }
    if(creep.ticksToLive < 150 && !spawn.spawning){
        if(creep.memory.renewing == null){
            creep.memory.renewing = 100;
        }
        creep.say("Renewing")
        return true;
    }
    return false;
}

module.exports.renewCreep = function(creep){
    var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
    if(!spawn){
        try{
            spawn = Game.rooms[Game.rooms[creep.memory.home].memory.reservee].find(FIND_MY_SPAWNS)[0];
        }catch(err){}
    }
    if(creep.carry.energy > 0){
        creep.transfer(spawn, RESOURCE_ENERGY)
    }
    if(spawn){
        //console.log(spawn.spawning.needTime)
        if(spawn.spawning && spawn.spawning.needTime && spawn.spawning.remainingTime < 5){
            creep.moveTo(Game.flags.Idle)
            //delete creep.memory.renewing;
            return
        }
        var code = spawn.renewCreep(creep);
        creep.moveTo(spawn);
        creep.memory.renewing = creep.memory.renewing - 1;
        if(creep.memory.renewing <= 0){
            delete creep.memory.renewing;
        }
        if(code == ERR_FULL){
            delete creep.memory.renewing;
        } else if (code == OK){
            creep.memory.renewing = creep.memory.renewing - 4;
        }
    }
}