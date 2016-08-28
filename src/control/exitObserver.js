module.exports = {

	run: function(){
		for (var i = 0; i < Game.creeps.length; i++) {
			var creep = Game.creeps[i];
			this.runRoom(creep);
		}
	},

	runCreep: function(creep){
		var pos = creep.pos;

		if(pos.y === 0){
			this.increment(pos, 0)
		} else if(pos.x === 49){
			this.increment(pos, 1)
		} else if(pos.y === 49){
			this.increment(pos, 2)
		} else if(pos.x === 0){
			this.increment(pos, 3)
		}
	},

	increment: function(pos, side){
		if(!Memory.rooms[pos.roomName]){
			Memory.rooms[pos.roomName] = {};
		}

		if(!Memory.rooms[pos.roomName].exits){
			Memory.rooms[pos.roomName].exits = [];
		}

		if(!Memory.rooms[pos.roomName].exits[side]){
			Memory.rooms[pos.roomName].exits[side] = {};
		}

		var key = pos.x + ":" + pos.y;

		if(!Memory.rooms[pos.roomName].exits[side][key]){
			Memory.rooms[pos.roomName].exits[side][key] = {
				x: pos.x,
				y: pos.y,
				use: 1
			};
		} else {
			Memory.rooms[pos.roomName].exits[side][key].use++;
		}
	}
}