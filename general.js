const goForwardStyle = {
    visualizePathStyle: {
        stroke: '#ffffff'
    }
};

const goHarvestStyle = {
    visualizePathStyle: {
        stroke: '#ffaa00'
    }
};

module.exports.checkReadyStatus = function(currCreep, workingStr) {
    if (currCreep.memory.working && currCreep.store[RESOURCE_ENERGY] == 0) {
        currCreep.memory.working = false;
        currCreep.say('🔄 harvest');
    }
    if (!currCreep.memory.working && currCreep.store.getFreeCapacity() == 0) {
        currCreep.memory.working = true;
        currCreep.say(workingStr);
    }
};


module.exports.isRepaireNeeded = function(currCreep) {
    const hittedTargets = currCreep.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax
    });

    // console.log(hittedTargets.length);
    hittedTargets.sort((a, b) => (b.hitsMax - b.hits) - (a.hitsMax - a.hits));
    // hittedTargets.forEach(a=> console.log(a.hits + ' ' + a.hitsMax  + ' ' + (a.hitsMax/a.hits)));

    return hittedTargets;
}

module.exports.achiveAndBuild = function(currCreep, actObject) {
    if (currCreep.build(actObject) == ERR_NOT_IN_RANGE) {
        currCreep.moveTo(actObject, goForwardStyle);
    }
}

module.exports.achiveAndHarvest = function(currCreep, actObject) {
    if (currCreep.harvest(actObject) == ERR_NOT_IN_RANGE) {
        currCreep.moveTo(actObject, goHarvestStyle);
    }
}

module.exports.achiveAndRepaire = function(currCreep, actObject) {
    if (currCreep.repair(actObject) == ERR_NOT_IN_RANGE) {
        currCreep.moveTo(actObject, goForwardStyle);
    }
}

module.exports.achiveAndTransfer = function(currCreep, actObject) {
    if (currCreep.transfer(actObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        currCreep.moveTo(actObject, goForwardStyle);
    }
}

module.exports.achiveAndWithdraw = function(currCreep, actObject) {
    if (currCreep.withdraw(actObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        currCreep.moveTo(actObject, goForwardStyle);
    }
}




module.exports.findFirstStructureByType = function(currCreep, structType) {
    return currCreep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == structType);
        }
    });

}

module.exports.BodyCost = function(currBody) {
    let sum = 0;
    for (let i in currBody)
        sum += BODYPART_COST[currBody[i]];
    return sum;
}

module.exports.freeMemory = function() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

module.exports.unlockCpu = function() {
    if (!data.user.resources || !data.user.resources[constants.CPU_UNLOCK] || (data.user.resources[constants.CPU_UNLOCK] < 1)) {
        return constants.ERR_NOT_ENOUGH_RESOURCES;
    }

    outMessage.cpuUnlocked = true;
    return constants.OK;
}

module.exports.showSpawnOperation = function() {
    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y, {
                align: 'left',
                opacity: 0.8
            });
    }
}

module.exports.getFreeSilos = function(currCreep) {
    return currCreep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_LINK) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
}


module.exports.closestSiloId = function(currCreep) {
    const closestSilo = currCreep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: function(structure) {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || Memory.SourceLinks.some((struct) => struct.id == structure.id)) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    return closestSilo ? closestSilo.id : null;
}

module.exports.closestSourceId = function(currCreep) {
    var closestSource = currCreep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (closestSource == null) {
        currCreep.memory.closestSource = Memory.waitPoint.id;
    }
    else {
        currCreep.memory.closestSource = closestSource.id;
    }
}


module.exports.calcBody = function(bodyPercentage) {
    var newBody = [];
    var capacity = Game.spawns['Spawn1'].room.energyCapacityAvailable / 1.8;

    bodyLoop:
        while (true) {
            for (let i = 0; i < bodyPercentage.get(WORK); i++) {
                newBody.push(WORK);
                if (this.BodyCost(newBody) > capacity) {
                    newBody.pop();
                    break bodyLoop;
                }
            }
            for (let i = 0; i < bodyPercentage.get(CARRY); i++) {
                newBody.push(CARRY);
                if (this.BodyCost(newBody) > capacity) {
                    newBody.pop();
                    break bodyLoop;
                }
            }
            for (let i = 0; i < bodyPercentage.get(MOVE); i++) {
                newBody.push(MOVE);
                if (this.BodyCost(newBody) > capacity) {
                    newBody.pop();
                    break bodyLoop;
                }
            }
        }
    return newBody;
}