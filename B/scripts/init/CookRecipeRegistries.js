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
import { registerCookable } from "../data/recipe/cookRecipe";
import { subscribeEvent } from "../lib/EventSubscriber";
let bool = true;
let num = 0;
export class CookRecipeRegistries {
    static initCookScoRegistries() {
        system.runInterval(() => {
            const allSco = world.scoreboard.getObjectives();
            if (!allSco?.length || !bool)
                return;
            for (const sco of allSco) {
                const name = sco.displayName;
                const reg = name.match(/farmersdelight_(\w+)/);
                if (reg) {
                    world.getDimension("overworld").runCommand(`function farmersdelight/cook_recipe_registries/${reg[1]}`);
                }
            }
            bool = false;
        });
    }
    registries(args) {
        const id = args.id;
        console.warn(id);
        if (id != "farmersdelight:cook")
            return;
        const message = args.message;
        try {
            const data = JSON.parse(message);
            const itemId = data.id;
            const recipe = {
                result: data.result,
                time: data.time || 200,
                exp: data.exp || 0.35,
                count: data.count
            };
            registerCookable(itemId, recipe);
            num++;
            console.warn(`已加载 §4${num}§f 个烧炼配方: ${itemId} -> ${recipe.result}`);
        }
        catch (error) {
            console.error(`配方注册失败: ${error}`);
            return;
        }
    }
}
__decorate([
    subscribeEvent(system.afterEvents.scriptEventReceive, { namespaces: ["farmersdelight"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CookRecipeRegistries.prototype, "registries", null);
