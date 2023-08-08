import { ItemStack, system, world } from "@minecraft/server";
const scoreboard = world.scoreboard;

function place(args) {
    const block = args.block;
    const dimension = args.dimension;
    const location = block.location;
    const V3 = { x: location.x + 0.5, y: location.y, z: location.z + 0.5 };
    switch (block.typeId) {
        case 'farmersdelight:cutting_board':
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
    const V3 = { x: location.x + 0.5, y: location.y + 1, z: location.z + 0.5 };
    const lores = itemStack.getLore();
    system.run(() => {
        if (itemStack.typeId === 'farmersdelight:cooking_pot' && args.block.typeId != 'farmersdelight:cooking_pot') {
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
        }
    });
}

world.beforeEvents.itemUseOn.subscribe(useOn);
world.afterEvents.blockPlace.subscribe(place);