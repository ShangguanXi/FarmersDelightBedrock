var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { itemComponent } from "../../lib/EventSubscriber";
import { resolveSpec } from "../../lib/ObjectUtil";
const BUILTIN_REMAINDERS = {
    "minecraft:water_bucket": "minecraft:bucket",
    "minecraft:milk_bucket": "minecraft:bucket",
    "minecraft:lava_bucket": "minecraft:bucket",
    "minecraft:powder_snow_bucket": "minecraft:bucket",
    "minecraft:honey_bottle": "minecraft:glass_bottle",
    "minecraft:potion": "minecraft:glass_bottle",
    "minecraft:dragon_breath": "minecraft:glass_bottle",
    "farmersdelight:milk_bottle": "minecraft:glass_bottle",
};
export function getRemainder(stack) {
    const spec = resolveSpec(stack, "farmersdelight:remainder");
    if (typeof spec === "string")
        return spec;
    return BUILTIN_REMAINDERS[stack.typeId];
}
let RemainderComponent = class RemainderComponent {
};
RemainderComponent = __decorate([
    itemComponent("farmersdelight:remainder")
], RemainderComponent);
export { RemainderComponent };
