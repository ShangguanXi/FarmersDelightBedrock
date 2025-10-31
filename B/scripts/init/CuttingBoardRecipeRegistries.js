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
import { methodEventSub } from "../lib/eventHelper";
import { BlockofAxeList, BlockofKnifeList, BlockofPickaxeList, BlockofShovelList, ItemofAxeList, ItemofKnifeList, ItemofPickaxeList, ItemofShearsList } from "../data/recipe/cuttingBoardRecipe";
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
            if (message.includes("?") && (message.split("?").length == 2)) {
                const recipeType = message.split("?")[1];
                if (recipeType == "ItemofPickaxeList") {
                    ItemofPickaxeList.unshift(message.split("?")[0]);
                    num++;
                }
                if (recipeType == "ItemofAxeList") {
                    ItemofAxeList.unshift(message.split("?")[0]);
                    num++;
                }
                if (recipeType == "ItemofShearsList") {
                    ItemofShearsList.unshift(message.split("?")[0]);
                    num++;
                }
                if (recipeType == "BlockofAxeList") {
                    BlockofAxeList.unshift(message.split("?")[0]);
                    num++;
                }
                if (recipeType == "BlockofPickaxeList") {
                    BlockofPickaxeList.unshift(message.split("?")[0]);
                    num++;
                }
                if (recipeType == "BlockofKnifeList") {
                    BlockofKnifeList.unshift(message.split("?")[0]);
                    num++;
                }
                if (recipeType == "BlockofShovelList") {
                    BlockofShovelList.unshift(message.split("?")[0]);
                    num++;
                }
            }
            else {
                ItemofKnifeList.unshift(message);
                num++;
            }
            console.warn(`已加载 §4${num}§f 个砧板配方`);
        }
        catch (error) {
            return;
        }
    }
}
__decorate([
    methodEventSub(system.afterEvents.scriptEventReceive, { namespaces: ["farmersdelight"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CuttingBoardRegistries.prototype, "registries", null);
