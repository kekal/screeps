var general = require('general');

function elabTargetList(currCreep, action) {
    if (targets.length) {
        if (action(targets[0]) == ERR_NOT_IN_RANGE) {
            currCreep.moveTo(targets[0], goForwardStyle);
        }
    }
}


var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, general.goForwardStyle);
            }
        }
        else {
            if (Game.time % Memory.sourceSearchPeriod == 0) {
                creep.memory.closestSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
            }

            general.achiveAndHarvest(creep, Game.getObjectById(creep.memory.closestSource));
        }
    }
};

module.exports = roleUpgrader;