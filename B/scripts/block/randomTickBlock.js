import { BlockPermutation, BlockVolumeUtils, system } from '@minecraft/server';
import { organicCompostDetectList } from '../data/recipe/organicCompostDetect'

function randomTick(args) {
    switch (args.id) {
        case 'farmersdelight:organic_transfer':
            let transChance = 0.1;
            let hasWater = false;
            const compostBlock = args.sourceBlock;
            const currentProcess = compostBlock.permutation.getState('farmersdelight:process');
            const location = args.sourceBlock.location;
            const dimension = args.sourceBlock.dimension;
            const fromLocation = { x: location.x - 1, y: location.y - 1, z: location.z - 1 };
            const toLocation = { x: location.x + 1, y: location.y + 1, z: location.z + 1 };
            const detectLocs = BlockVolumeUtils.getBlockLocationIterator({ from: fromLocation, to: toLocation });
            for (const loc of detectLocs) {
                const block = dimension.getBlock(loc);
                if (organicCompostDetectList.includes(block.typeId)) {
                    transChance += 0.02;
                }
                else if (block.hasTag('compost_activators')) {
                    transChance += 0.02;
                }
                else if (block.typeId == 'minecraft:water') {
                    hasWater = true;
                };
            };
            if (hasWater) {
                transChance += 0.1;
            };
            if (Math.random() < transChance){
                if (currentProcess < 7){
                    compostBlock.setPermutation(compostBlock.permutation.withState('farmersdelight:process', currentProcess + 1));
                }
                else{
                    compostBlock.setPermutation(BlockPermutation.resolve('farmersdelight:rich_soil'));
                };
            };
            break;
        case 'farmersdelight:rich_soil_tick':
            break;
    }
}

system.afterEvents.scriptEventReceive.subscribe(randomTick, { 'namespaces': ['farmersdelight'] });