import { ItemStack, system, world } from "@minecraft/server";
import { claerItem } from "../lib/itemUtil";
const scoreboard = world.scoreboard;

function place(args) {
    const block = args.block;
    const dimension = args.dimension;
    const location = block.location;
    const V3 = { x: location.x + 0.5, y: location.y, z: location.z + 0.5 };
    switch (block.typeId) {
        case 'farmersdelight:cutting_board':
            console.warn(JSON.stringify(V3));
            const cuttingBoard = dimension.spawnEntity('farmersdelight:cutting_board', V3);
            cuttingBoard.addTag(JSON.stringify(V3));
            break;
        case 'farmersdelight:skillet_block':
            const skilletBlock = dimension.spawnEntity('farmersdelight:skillet', V3);
            skilletBlock.addTag(JSON.stringify(V3));
            skilletBlock.addTag('{"item":"undefined"}');
            scoreboard.addObjective(skilletBlock.id, skilletBlock.id).setScore('amount', 0);
            break;
        case 'farmersdelight:stove':
            const stove = dimension.spawnEntity('farmersdelight:stove', V3);
            stove.addTag(JSON.stringify(V3));
            scoreboard.addObjective(stove.id, stove.id).setScore('amount', 0);
            break;
    }
}

function useOn(args) {
    const itemStack = args.itemStack;
    const location = args.block.location;
    const player = args.source;
    let V3;
    const lores = itemStack.getLore();
    const faceLocation = args.blockFace;
    switch (faceLocation) {
        case 'Up':
            V3 = { x: location.x + 0.5, y: location.y + 1, z: location.z + 0.5 };
            break;
        case 'Down':
            V3 = { x: location.x + 0.5, y: location.y - 1, z: location.z + 0.5 };
            break;
        case 'East':
            V3 = { x: location.x + 0.5 + 1, y: location.y, z: location.z + 0.5 };
            break;
        case 'North':
            V3 = { x: location.x + 0.5, y: location.y, z: location.z + 0.5 - 1 };
            break;
        case 'South':
            V3 = { x: location.x + 0.5, y: location.y, z: location.z + 0.5 + 1 };
            break;
        case 'West':
            V3 = { x: location.x + 0.5 - 1, y: location.y, z: location.z + 0.5 };
            break;
    }
    system.run(() => {
        if (itemStack.typeId === 'farmersdelight:cooking_pot' && args.block.typeId != 'farmersdelight:cooking_pot') {
            if (player.isSneaking) {
                const cookingPot = player.dimension.spawnEntity('farmersdelight:cooking_pot', V3);
                const container = cookingPot.getComponent('inventory').container;
                cookingPot.addTag(JSON.stringify(V3));
                if (lores.length) {
                    lores.forEach(lore => {
                        const re = /\d+|\S+:\S+/g;
                        const data = lore.match(re);
                        if (data) {
                            const slot = container.getSlot(6);
                            const cookingItemStack = new ItemStack(data[1]);
                            cookingItemStack.amount = parseInt(data[0]);
                            cookingItemStack.lockMode = 'slot';
                            slot.setItem(cookingItemStack);
                        }
                    });
                }
            } else {
                args.cancel = true;
            }
        }
    });
}

world.beforeEvents.itemUseOn.subscribe(useOn);
world.afterEvents.blockPlace.subscribe(place);