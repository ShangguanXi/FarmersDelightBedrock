var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BlockPermutation, Direction, EntityEquippableComponent, EntityHealthComponent, EntityInventoryComponent, EquipmentSlot, ItemStack, PlayerInteractWithBlockAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { EntityUtil } from "../lib/EntityUtil";
import { ItemUtil } from "../lib/ItemUtil";
function spawnLoot(path, dimenion, location) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`);
}
function level(level) {
    if (!level) {
        return 0;
    }
    else {
        return level;
    }
}
export class Knife {
    //刀掉落物改变机制有关的战利品
    hurt(args) {
        const entity = args.damageSource.damagingEntity;
        const hurt = args.hurtEntity;
        if (!entity || !hurt)
            return;
        const equipment = entity.getComponent(EntityEquippableComponent.componentId);
        const mainHand = equipment?.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!mainHand?.hasTag('farmersdelight:is_knife'))
            return;
        const Looting = equipment?.getEquipmentSlot(EquipmentSlot.Mainhand).getItem()?.getComponent("minecraft:enchantable")?.getEnchantment("looting")?.level;
        const health = hurt.getComponent(EntityHealthComponent.componentId);
        const onFire = hurt.getComponent('minecraft:onfire')?.onFireTicksRemaining;
        const random = Math.floor(Math.random() * 10);
        if (!health?.currentValue && hurt.typeId === 'minecraft:pig' && random < (5 + level(Looting))) {
            if (!onFire) {
                hurt.dimension.spawnItem(new ItemStack('farmersdelight:ham'), hurt.location);
            }
            else {
                hurt.dimension.spawnItem(new ItemStack('farmersdelight:smoked_ham'), hurt.location);
            }
        }
        ;
        if (!health?.currentValue && hurt.typeId === 'minecraft:chicken') {
            hurt.dimension.spawnItem(new ItemStack('minecraft:feather'), hurt.location);
        }
        ;
        if (!health?.currentValue && hurt.typeId === 'minecraft:hoglin') {
            if (!onFire) {
                hurt.dimension.spawnItem(new ItemStack('farmersdelight:ham'), hurt.location);
            }
            else {
                hurt.dimension.spawnItem(new ItemStack('farmersdelight:smoked_ham'), hurt.location);
            }
        }
        ;
        const leatherAnimals = ["minecraft:cow", "minecraft:mooshroom", "minecraft:donkey", "minecraft:horse", "minecraft:mule", "minecraft:llama", "minecraft:trader_llama"];
        if (!health?.currentValue && hurt.typeId in leatherAnimals) {
            hurt.dimension.spawnItem(new ItemStack('minecraft:leather'), hurt.location);
        }
        ;
        if (!health?.currentValue && hurt.typeId === 'minecraft:rabbit') {
            hurt.dimension.spawnItem(new ItemStack('minecraft:rabbit_hide'), hurt.location);
        }
        ;
        if (!health?.currentValue && hurt.typeId === 'minecraft:shulker') {
            hurt.dimension.spawnItem(new ItemStack('minecraft:shulker_shell'), hurt.location);
        }
        ;
        if (!health?.currentValue && hurt.typeId in ['minecraft:spider', 'minecraft:cave_spider']) {
            hurt.dimension.spawnItem(new ItemStack('minecraft:trip_wire'), hurt.location);
        }
        ;
    }
    //草秆
    break(args) {
        const player = args.player;
        const itemStack = args.itemStackAfterBreak;
        const block = args.block;
        const permutation = args.brokenBlockPermutation;
        const blockTypeId = args.brokenBlockPermutation.type.id;
        if (!itemStack?.hasTag("farmersdelight:is_knife"))
            return;
        if (EntityUtil.gameMode(player)) {
            const container = player.getComponent(EntityInventoryComponent.componentId)?.container;
            if (!container)
                return;
            ItemUtil.damageItem(container, player.selectedSlotIndex);
            if (blockTypeId == "minecraft:tallgrass") {
                spawnLoot('farmersdelight/straw_from_grass', block.dimension, block.location);
            }
            else if (blockTypeId == "minecraft:double_plant") {
                const type = permutation.getState('double_plant_type');
                if (type == 'grass' || type == 'fern')
                    spawnLoot('farmersdelight/straw_from_grass', block.dimension, block.location);
            }
            else if (blockTypeId == "minecraft:wheat") {
                const age = permutation.getState('growth');
                if (age == 7)
                    spawnLoot('farmersdelight/straw', block.dimension, block.location);
            }
            else if (blockTypeId == "farmersdelight:rice_block_upper") {
                const age = permutation.getState('farmersdelight:growth');
                if (age == 3)
                    spawnLoot('farmersdelight/straw', block.dimension, block.location);
            }
            else if (blockTypeId == "farmersdelight:sandy_shrub_block") {
                spawnLoot('farmersdelight/straw_from_sandy_shrub', block.dimension, block.location);
            }
        }
    }
    //与南瓜互动
    useOn(args) {
        const player = args.player;
        const itemStack = args.itemStack;
        const block = args.block;
        if (!itemStack || !itemStack?.hasTag("farmersdelight:is_knife") || block.typeId != "minecraft:pumpkin")
            return;
        const face = args.blockFace;
        const dimenion = args.block.dimension;
        if (EntityUtil.gameMode(player)) {
            const container = player.getComponent(EntityInventoryComponent.componentId)?.container;
            if (!container)
                return;
            ItemUtil.damageItem(container, player.selectedSlotIndex);
        }
        if (face == Direction.Up || face == Direction.Down) {
            const direction = EntityUtil.cardinalDirection(player);
            block.setPermutation(BlockPermutation.resolve('minecraft:carved_pumpkin', { 'minecraft:cardinal_direction': direction?.toLocaleLowerCase() }));
            dimenion.spawnItem(new ItemStack('minecraft:pumpkin_seeds', 4), block.location);
        }
        else {
            block.setPermutation(BlockPermutation.resolve('minecraft:carved_pumpkin', { 'minecraft:cardinal_direction': face?.toLocaleLowerCase() }));
            dimenion.spawnItem(new ItemStack('minecraft:pumpkin_seeds', 4), block.location);
        }
    }
}
__decorate([
    methodEventSub(world.afterEvents.entityHurt),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Knife.prototype, "hurt", null);
__decorate([
    methodEventSub(world.afterEvents.playerBreakBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Knife.prototype, "break", null);
__decorate([
    methodEventSub(world.afterEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], Knife.prototype, "useOn", null);
//# sourceMappingURL=Knife.js.map