var roleExtractor = {
	
	/** @param {Creep} creep **/
	run: function(creep) {
		var reservee = null;
		try{
			reservee = Game.rooms[Game.rooms[creep.memory.home].memory.reservee];
		} catch(_){}
		var room = Game.rooms[creep.memory.home];
		if(!room){
			creep.moveTo(new RoomPosition(25, 25, creep.memory.home));
			return;
		}
		var target = room.find(FIND_MINERALS)[0];
		if(!target){
			creep.say("Target?")
			return;
		}

		if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target);
		}
	},

	getDesign: function(budget, room){
		return [WORK,WORK,WORK,WORK,WORK,MOVE];
	}
}

module.exports = roleExtractor;