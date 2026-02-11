var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { system, world } from "@minecraft/server";
import { cuttingBoardRecipeManager } from "../data/recipe/cuttingBoardRecipe";
import { subscribeEvent } from "../lib/EventSubscriber";
let bool = true;
let num = 0;
export class CuttingBoardRegistries {
    static initCuttingBoardScoRegistries() {
        system.runInterval(() => {
            const allSco = world.scoreboard.getObjectives();
            if (!allSco?.length || !bool)
                return;
            for (const sco of allSco) {
                const name = sco.displayName;
                const reg = name.match(/farmersdelight_(\w+)/);
                if (reg) {
                    world.getDimension("overworld").runCommand(`function farmersdelight/cutting_board_recipe_registries/${reg[1]}`);
                }
            }
            bool = false;
        });
    }
    registries(args) {
        const id = args.id;
        if (id != "farmersdelight:cutting_board_recipe")
            return;
        const message = args.message;
        try {
            const data = JSON.parse(message);
            const ingredients = data.ingredients;
            if (!ingredients) {
                console.warn(`[FarmersDelight] Missing 'ingredients' field in cutting board recipe: ${message}`);
                return;
            }
            const tool = data.tool;
            if (!tool || (!tool.tag && !tool.item)) {
                console.warn(`[FarmersDelight] Missing or invalid 'tool' field in cutting board recipe: ${message}`);
                return;
            }
            const result = data.result;
            if (!result || !Array.isArray(result) || result.length === 0) {
                console.warn(`[FarmersDelight] Missing or empty 'result' field in cutting board recipe: ${message}`);
                return;
            }
            const is_block_type = !!data.is_block_type;
            const sound = data.sound ?? "use.wood";
            const recipe = {
                ingredients,
                tool,
                result,
                is_block_type,
                sound,
            };
            if (typeof data.exp === "number") {
                recipe.exp = data.exp;
            }
            cuttingBoardRecipeManager.addRecipe(recipe);
        }
        catch (e) {
            console.warn(`[FarmersDelight] Failed to register cutting board recipe: ${e}\nOriginal message: ${message}`);
        }
    }
}
__decorate([
    subscribeEvent(system.afterEvents.scriptEventReceive, { namespaces: ["farmersdelight"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CuttingBoardRegistries.prototype, "registries", null);
