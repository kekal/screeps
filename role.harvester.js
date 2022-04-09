var general = require('general');



var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        general.checkReadyStatus(creep, '🌿 store');

        if (!creep.memory.working) {
            if (Game.time % Memory.sourceSearchPeriod == 0) {
                var closestSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (closestSource == null) {
                    creep.memory.closestSource = Memory.waitPoint.id;
                }
                else {
                    creep.memory.closestSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
                }
            }
            var pathLengthToLink = creep.pos.findPathTo(Memory.TargetLink).length;
            // console.log(pathLengthToLink);

            if (Memory.TargetLink.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && pathLengthToLink < 10) {
                // creep.say('search link');
                general.achiveAndWithdraw(creep, Memory.TargetLink);
            }

            else if (creep.harvest(Game.getObjectById(creep.memory.closestSource)) == ERR_NOT_IN_RANGE) {
                // creep.say('gonna harvest');
                creep.moveTo(Game.getObjectById(creep.memory.closestSource), general.goHarvestStyle);
            }
        }
        else {
            var targets = general.getFreeSilos(creep)

            if (targets.length > 0) {
                // creep.say('gonna store');

                var closestSilo = Game.getObjectById(general.closestSiloId(creep));

                general.achiveAndTransfer(creep, closestSilo);
            }
            else {
                  // creep.say('gonna rest');

                creep.moveTo(Memory.waitPoint, general.goForwardStyle);
            }
        }
    }
};

module.exports = roleHarvester;