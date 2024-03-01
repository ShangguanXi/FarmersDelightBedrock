import { MinecraftDimensionTypes, Scoreboard, ScoreboardObjective, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { vanillaCookingPotRecipe } from "../data/recipe/cookingPotRecipe";

const scoreboard: Scoreboard = world.scoreboard;
let bool: boolean = true;
let num: number = 0;

export class CookingPotRecipeRegistries {
    public static initCookingPotScoRegistries() {
        system.runInterval(() => {
            const allSco: ScoreboardObjective[] | undefined = scoreboard.getObjectives();
            if (!allSco?.length || !bool) return;
            for (const sco of allSco) {
                const name: string = sco.displayName;
                const reg: RegExpMatchArray | null = name.match(/farmersdelight_(\w+)/);
                if (reg) {
                    world.getDimension(MinecraftDimensionTypes.overworld).runCommandAsync(`function farmersdelight/cooking_pot_recipe_registries/${reg[1]}`);
                }
            }
            bool = false;
        })
    }
    @methodEventSub(system.afterEvents.scriptEventReceive, { namespaces: ["farmersdelight"] })
    registries(args: any) {
        const id: string = args.id;
        if (id != "farmersdelight:cooking_pot_recipe") return;
        const message: string = args.message;
        try {
            const json: any = JSON.parse(message);
            if (!(json.time || json.ingredients || json.result)) return;
            if (!json.ingredients.length || !json.result.item) return;
            vanillaCookingPotRecipe.recipe.push(json);
            num++;
            console.warn(`已加载 §4${num}§f 个厨锅配方`);
        } catch (error) {
            return;
        }
    }
}