var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityEquippableComponent, EntityHealthComponent, EquipmentSlot, ItemStack, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
export class Knife {
    hurt(args) {
        const entity = args.damageSource.damagingEntity;
        const hurt = args.hurtEntity;
        if (!entity || !hurt)
            return;
        const equipment = entity.getComponent(EntityEquippableComponent.componentId);
        const mainHand = equipment?.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!mainHand?.hasTag('farmersdelight:is_knife'))
            return;
        const health = hurt.getComponent(EntityHealthComponent.componentId);
        const random = Math.floor(Math.random() * 10);
        if (!health?.currentValue && hurt.typeId === 'minecraft:pig' && random < 5) {
            hurt.dimension.spawnItem(new ItemStack('farmersdelight:ham'), hurt.location);
        }
    }
}
__decorate([
    methodEventSub(world.afterEvents.entityHurt),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Knife.prototype, "hurt", null);
//# sourceMappingURL=Knife.js.map