var general = require('general');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        general.checkReadyStatus(creep, '🚧 build');

        if (!creep.memory.working) {
            if (Game.time % Memory.sourceSearchPeriod == 0) {
                creep.memory.closestSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
            }

            general.achiveAndHarvest(creep, Game.getObjectById(creep.memory.closestSource));
        }
        else {
            var constractionsList = creep.room.find(FIND_CONSTRUCTION_SITES);
            const hittedTargets = general.isRepaireNeeded(creep);

            if (constractionsList.length) {
                general.achiveAndBuild(creep, constractionsList[0]);
            }
            else if (hittedTargets.length) {
                general.achiveAndRepaire(creep, hittedTargets[0]);
            }
            else {
                // constractionsList = general.findFirstStructureByType(creep, STRUCTURE_EXTENSION);
                creep.moveTo(Memory.waitPoint, goForwardStyle);
            }
        }
    }
};

module.exports = roleBuilder;