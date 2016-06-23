module.exports = {
    gcCreep: function(){
        for(var name in Memory.creeps){
            if(Game.creeps[name] == null){
                //This creep is dead. 
                console.log("Performing GC on creep "+name);
                var mem = Memory.creeps[name];
                if(mem && mem.source){
                    //This was a miner. We must release the slot so that a new miner can take over
                    var source = Game.getObjectById(mem.source);
                    try{
                        var roomRef = Game.rooms[mem.home].memory.sources[mem.source].miners;
                        if(roomRef.indexOf(name)){
                            roomRef.splice(roomRef.indexOf(name), 1);//Remove name and shuffle
                        }
                    } catch(err){
                        console.log("ERROR: " + err)
                    }
                }
                delete Memory.creeps[name];//Wipe the creep memory
            }
        }
    }
};