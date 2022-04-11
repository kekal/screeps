var general = require('general');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleEngineer = require('role.engineer');




module.exports.loop = function() {
    Memory.isSpawning = false;
    Memory.waitPoint = Game.getObjectById('bb474b452371ab6aaace6074');
    Memory.sourceSearchPeriod = 10;

    var sourceLink1 = Game.getObjectById('217727f28d55153439286814');
    var sourceLink2 = Game.getObjectById('9886d70e0fea2ab6e9ab3ee1');
    var sourceLink3 = Game.getObjectById('1816597357c09b3fec47385e');
    
    var targetLink = Game.getObjectById('fce2a2282b823f2433bcdf5c');

    Memory.SourceLinks = [sourceLink1, sourceLink2, sourceLink3];
    Memory.TargetLink = targetLink;


    // general.unlockCpu();
    general.freeMemory();

    createCreep('harvester', 5, general.calcBody(new Map([[WORK, 1], [CARRY, 1], [MOVE, 2]])));
    createCreep('upgrader', 2, general.calcBody(new Map([[WORK, 1], [CARRY, 2], [MOVE, 2]])));
    createCreep('builder', 5, general.calcBody(new Map([[WORK, 2], [CARRY, 1], [MOVE, 1]])));
    createCreep('engineer', 2, general.calcBody(new Map([[WORK, 1], [CARRY, 1], [MOVE, 3]])));

    Memory.isSpawning = false;

    general.showSpawnOperation();

    assigneRoles();


    // console.log(sourceLink.transferEnergy(targetLink));
    sourceLink1.transferEnergy(targetLink);
    sourceLink2.transferEnergy(targetLink);
    sourceLink3.transferEnergy(targetLink);
}


function createCreep(roleName, count, creepBody) {
    if (Memory.isSpawning) {
        return;
    }

    var creepers = _.filter(Game.creeps, (creep) => creep.memory.role == roleName);
    //console.log(roleName + 's: ' + creepers.length);

    if (creepers.length < count) {
        Memory.isSpawning = true;

        console.log('Needed new ' + roleName + ' for ' + general.BodyCost(creepBody) + ' energy. Currenttly available: ' + Game.spawns['Spawn1'].room.energyAvailable + '/' + Game.spawns['Spawn1'].room.energyCapacityAvailable)
        var newName = roleName + Game.time;
        if (Game.spawns['Spawn1'].spawnCreep(creepBody, newName, {
                memory: {
                    role: roleName,
                    closestSource: Game.spawns['Spawn1'].pos.findClosestByPath(FIND_SOURCES_ACTIVE)
                }
            }) == 0) {
            console.log('Spawning new ' + roleName + ': ' + newName);
        }
    }
}



function assigneRoles() {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'engineer') {
            roleEngineer.run(creep);
        }
    }
}