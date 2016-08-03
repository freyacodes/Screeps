var roleHarvester = require("role.harvester");
var roleBuilder = require("role.builder");
var roleWarrior = require("role.warrior");
var roleUpgrader = require("role.upgrader");
var roleRepairman = require("role.upgrader");
var roleClaimnant = require("role.claimnant");
var roleRoadbuilder = require("role.roadbuilder");
var roleCarrier = require('role.carrier');

module.exports = {
	harvester: roleHarvester,
	builder: roleBuilder,
	warrior: roleWarrior,
	upgrader: roleUpgrader,
	repairman: roleRepairman,
	claimnant: roleClaimnant,
	roadbuilder: roleRoadbuilder,
	carrier: roleCarrier
}