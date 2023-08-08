import { BlockPermutation, BlockVolumeUtils } from '@minecraft/server';

export function richSoilFarmland(args) {
    const farmlandBlock = args.sourceBlock;
    const location = args.sourceBlock.location;
    const dimension = args.sourceBlock.dimension;
    const fromLocation = { x: location.x - 4, y: location.y, z: location.z - 4 };
    const toLocation = { x: location.x + 4, y: location.y + 1, z: location.z + 4 };
    const detectLocs = BlockVolumeUtils.getBlockLocationIterator({ from: fromLocation, to: toLocation });
    const moisturizedAmount = farmlandBlock.permutation.getState('farmersdelight:moisturized_amount');
    let hasWater = false;
    for (const loc of detectLocs) {
        const block = dimension.getBlock(loc);
        if (block.typeId == 'minecraft:water') {
            hasWater = true;
            break;
        };
    };
    if (hasWater) {
        if (moisturizedAmount < 7) {
            farmlandBlock.setPermutation(farmlandBlock.permutation.withState('farmersdelight:moisturized_amount', moisturizedAmount + 1));
        };
    }
    else {
        if (moisturizedAmount > 0) {
            farmlandBlock.setPermutation(farmlandBlock.permutation.withState('farmersdelight:moisturized_amount', moisturizedAmount - 1));
        }
        else {
            farmlandBlock.setPermutation(BlockPermutation.resolve('farmersdelight:rich_soil'));
        };
    };
    const cropBlock = dimension.getBlock({ x: location.x, y: location.y + 1, z: location.z });
    if (cropBlock.hasTag('crop')) {
        const tags = cropBlock.getTags();
        const growthTag = /^max_growth:+[0-9]$/;
        const propertyTag = /^growth_property:/;
        let maxGrowth, growthProperty;
        for (const tag of tags){
            if (tag.match(growthTag)){
                maxGrowth = Number(tag[11]);
            };
            if (tag.match(propertyTag)){
                growthProperty = tag.substring(16);
            };
        };
        if (maxGrowth && growthProperty){
            const growth = cropBlock.permutation.getState(growthProperty);
            if (growth < maxGrowth){
                cropBlock.setPermutation(cropBlock.permutation.withState(growthProperty, growth + 1));
            };
        };
    };
};