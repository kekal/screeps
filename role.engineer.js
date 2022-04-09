var general = require('general');

var roleEngineer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const hittedTargets = general.isRepaireNeeded(creep);

        general.checkReadyStatus(creep, '🚧 repaire');

        if (!creep.memory.working) {
            if (Game.time % Memory.sourceSearchPeriod == 0) {
                general.closestSourceId(creep);
            }

            general.achiveAndHarvest(creep, Game.getObjectById(creep.memory.closestSource));
        }
        else {
            if (hittedTargets.length) {
                general.achiveAndRepaire(creep, hittedTargets[0]);
                return;
            }
            var constractionsList = creep.room.find(FIND_CONSTRUCTION_SITES);

            if (constractionsList.length) {
                general.achiveAndBuild(creep, constractionsList[0]);
            }
            else {
                // constractionsList = general.findFirstStructureByType(creep, STRUCTURE_EXTENSION);
                creep.moveTo(Memory.waitPoint, pathStyle);
            }
        }
    }
};

module.exports = roleEngineer;