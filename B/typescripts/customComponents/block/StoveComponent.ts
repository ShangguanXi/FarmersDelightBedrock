import {
    Block,
    BlockComponentPlayerInteractEvent,
    BlockComponentPlayerPlaceBeforeEvent,
    BlockComponentStepOffEvent,
    BlockComponentStepOnEvent,
    CustomComponentParameters,
    Entity,
    EntityComponentTypes,
    EntityDamageCause,
    EquipmentSlot,
    GameMode,
    ItemStack,
    system,
} from "@minecraft/server";
import { convertItemInSlot, giveItem, hurtItemInSlot, isEnchanted, takeItemInSlot } from "../../lib/ItemUtil";
import { blockComponent } from "../../lib/EventSubscriber";
import { BlockEntityComponent } from "./BlockEntityComponent";
import { getBlockEntity } from "../../lib/BlockWithEntity";
import { makeUniqueId } from "../../lib/BlockUtil";
import { getEquipment } from "../../lib/EntityUtil";
import { findCookingRecipe } from "../../data/recipe/cookRecipe";

function ignite(block: Block, sound: string) {
    block.setPermutation(block.permutation.withState("farmersdelight:is_working", true));
    block.dimension.playSound(sound, block.bottomCenter());
}

function extinguish(block: Block) {
    block.setPermutation(block.permutation.withState("farmersdelight:is_working", false));
    block.dimension.playSound("random.fizz", block.bottomCenter());
}

function burnEntity(entity: Entity) {
    if (entity.isSneaking) return;
    const stack = getEquipment(entity, EquipmentSlot.Feet);
    if (isEnchanted(stack, "frost_walker")) return;
    entity.applyDamage(1, { cause: EntityDamageCause.fire });
}

const BURN_ENTITY_CONTEXTS: Map<string, BurnEntityContext> = new Map();

@blockComponent("farmersdelight:stove")
export class StoveComponent extends BlockEntityComponent {
    beforeOnPlayerPlace(event: BlockComponentPlayerPlaceBeforeEvent, _: CustomComponentParameters): void {
        event.permutationToPlace = event.permutationToPlace.withState("farmersdelight:is_working", true);
    }

    onPlayerInteract(event: BlockComponentPlayerInteractEvent, params: CustomComponentParameters): void {
        const player = event.player;
        const container = player?.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!container) return;
        const selected = container!!.getSlot(player!!.selectedSlotIndex);
        const stack = selected.getItem();
        if (stack) {
            const block = event.block;
            const typeId = stack.typeId;
            if (block.permutation.getState("farmersdelight:is_working")) {
                if (typeId === "minecraft:water_bucket") {
                    extinguish(block);
                    let remaining: ItemStack | undefined = new ItemStack("minecraft:bucket");
                    if (player.getGameMode() !== GameMode.Creative) {
                        remaining = convertItemInSlot(selected, remaining);
                    }
                    giveItem(player, remaining, container);
                    return;
                }
                if (stack.hasTag("minecraft:is_shovel")) {
                    extinguish(block);
                    hurtItemInSlot(selected, stack);
                    return;
                }
            } else {
                if (typeId === "minecraft:fire_charge") {
                    ignite(block, "mob.blaze.shoot");
                    takeItemInSlot(selected, 1, false);
                    return;
                }
                if (typeId === "minecraft:flint_and_steel" || isEnchanted(stack, "fire_aspect")) {
                    ignite(block, "fire.ignite");
                    hurtItemInSlot(selected, stack);
                    return;
                }
            }
            if (!block.above()?.isAir) return;
            const recipe = findCookingRecipe(stack);
            if (!recipe) return;
            const entity = getBlockEntity(block, params.params);
            const stove = entity?.getComponent(EntityComponentTypes.Inventory)?.container;
            const slot = stove?.firstEmptySlot();
            if (slot === undefined) return;
            stack.amount = 1;
            stove!!.setItem(slot, stack);
            entity!!.setDynamicProperty(`farmersdelight:item_${slot}_max_time`, recipe.time);
            if (player.getGameMode() !== GameMode.Creative) {
                takeItemInSlot(selected, 1, false);
            }
        } else {
            const block = event.block;
            const entity = getBlockEntity(block, params.params);
            const stove = entity?.getComponent(EntityComponentTypes.Inventory)?.container;
            if (!stove) return;
            const dimension = event.dimension;
            for (let i = stove.size - 1; i >= 0; --i) {
                const stack = stove.getItem(i);
                if (stack) {
                    dimension.spawnItem(stack, {
                        x: block.x + 0.5,
                        y: block.y + 1.0,
                        z: block.z + 0.5,
                    })?.clearVelocity();
                    stove.setItem(i, undefined);
                    entity.setDynamicProperties({
                        [`farmersdelight:item_${i}_time`]: undefined,
                        [`farmersdelight:item_${i}_max_time`]: undefined,
                    });
                    return;
                }
            }
        }
    }

    onStepOn(event: BlockComponentStepOnEvent, _: CustomComponentParameters): void {
        const entity = event.entity;
        if (!entity) return;
        const block = event.block;
        const uid = makeUniqueId(block);
        let context = BURN_ENTITY_CONTEXTS.get(uid);
        if (!context) {
            context = new BurnEntityContext(block);
            BURN_ENTITY_CONTEXTS.set(uid, context);
        }
        context.push(entity);
    }

    onStepOff(event: BlockComponentStepOffEvent, _: CustomComponentParameters): void {
        const entity = event.entity;
        if (!entity) return;
        const context = BURN_ENTITY_CONTEXTS.get(makeUniqueId(event.block));
        if (context) {
            context.remove(entity);
        }
    }
}

class BurnEntityContext {
    private readonly source: Block;
    private readonly task: number;
    private readonly entities: Entity[];

    constructor(source: Block) {
        this.source = source;
        this.entities = [];
        this.task = system.runInterval(this.tick.bind(this));
    }

    discard() {
        this.entities.length = 0;
        system.clearRun(this.task);
        BURN_ENTITY_CONTEXTS.delete(makeUniqueId(this.source));
    }

    burnEntities() {
        const entities = this.entities;
        for (let i = entities.length - 1; i >= 0; --i) {
            const entity = entities[i];
            if (entity.isValid && entity.getComponent(EntityComponentTypes.Health)?.currentValue) {
                burnEntity(entity);
            } else {
                entities.splice(i, 1);
            }
        }
    }

    tick() {
        const block = this.source;
        if (block.isValid && block.getComponent("farmersdelight:stove")) {
            if (!block.permutation.getState("farmersdelight:is_working")) return;
            this.burnEntities();
            if (this.entities.length) return;
        }
        this.discard();
    }

    push(entity: Entity) {
        const entities = this.entities;
        for (let i = entities.length - 1; i >= 0; --i) {
            if (entities[i].id === entity.id) return;
        }
        entities.push(entity);
    }

    remove(entity: Entity) {
        const entities = this.entities;
        for (let i = entities.length - 1; i >= 0; --i) {
            const candidate = entities[i];
            if (candidate.id === entity.id) {
                entities.splice(i, 1);
                break;
            }
        }
        if (!entities.length) {
            this.discard();
        }
    }
}