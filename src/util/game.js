Game.roleDebug = function(){
	var roles = {};

	for(var i in Game.creeps){
		var creep = Game.creeps[i];
		var role = creep.memory.role;
		if(roles[role] == null){
			roles[role] = 1;
		} else {
			roles[role]++;
		}
	}

	console.log(JSON.stringify(roles, null, 2));
}