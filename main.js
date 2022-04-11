var general = require('general');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleEngineer = require('role.engineer');




module.exports.loop = function() {
    Memory.waitPoint = Game.getObjectById('bb474b452371ab6aaace6074');
    Memory.sourceSearchPeriod = 10;

    Memory.TargetLink = Game.getObjectById('fce2a2282b823f2433bcdf5c');
    Memory.SourceLinks = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_LINK && structure.id != Memory.TargetLink.id)
        }
    });
    Memory.SourceLinks.forEach(link => link.transferEnergy(Memory.TargetLink));



    // general.unlockCpu();
    general.freeMemory();

    createCreep('harvester', 5, general.calcBody(new Map([[WORK, 1], [CARRY, 1], [MOVE, 2]])));
    createCreep('upgrader', 2, general.calcBody(new Map([[WORK, 2], [CARRY, 3], [MOVE, 1]])));
    createCreep('builder', 5, general.calcBody(new Map([[WORK, 2], [CARRY, 1], [MOVE, 1]])));
    createCreep('engineer', 2, general.calcBody(new Map([[WORK, 1], [CARRY, 2], [MOVE, 3]])));

    general.showSpawnOperation();

    assigneRoles();
    var nearCreeps = Game.spawns['Spawn1'].room.find(FIND_MY_CREEPS, {
        filter: cre => cre.pos.isNearTo(Game.spawns['Spawn2'])
    });


    // var nearCreeps = Game.spawns['Spawn2'].room.creeps.filter(cre => cre.pos.isNearTo(Game.spawns['Spawn2']));
    if (nearCreeps.length > 0) {
        Game.spawns['Spawn2'].renewCreep(nearCreeps[0]);
        Game.spawns['Spawn2'].room.visual.text('Renewing ' + nearCreeps[0].name);
        Game.spawns['Spawn1'].room.visual.text(
            'Renewing ' + nearCreeps[0].name,
            Game.spawns['Spawn2'].pos.x + 1,
            Game.spawns['Spawn2'].pos.y, {
                align: 'left',
                opacity: 0.5
            });
    }
}


function createCreep(roleName, count, creepBody) {
    var creepers = _.filter(Game.creeps, (creep) => creep.memory.role == roleName);
    //console.log(roleName + 's: ' + creepers.length);

    if (creepers.length < count) {
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