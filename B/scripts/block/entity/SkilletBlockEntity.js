import { BlockEntity } from "./BlockEntity";
import { heatConductors, heatSources } from "../../data/heatBlocks";
const skilletV2 = [];
for (let i = 0; i < 5; i++) {
    const json = {};
    json.x = (Math.random() * 2 - 1) * 0.15 * 0.5;
    json.z = (Math.random() * 2 - 1) * 0.15 * 0.5;
    skilletV2.push(json);
}
//检查热源
function heatCheck(block) {
    const blockBelow = block.below();
    if (heatSources.includes(blockBelow?.typeId) || blockBelow?.hasTag('farmersdelight:heat_source'))
        return true;
    if (heatConductors.includes(blockBelow?.typeId) || blockBelow?.hasTag('farmersdelight:heat_conductors')) {
        const blockBelow2 = block.below(2);
        if (heatSources.includes(blockBelow2?.typeId) || blockBelow2?.hasTag('farmersdelight:heat_source'))
            return true;
    }
    return false;
}
export class SkilletBlockEntity extends BlockEntity {
}
//# sourceMappingURL=SkilletBlockEntity.js.map