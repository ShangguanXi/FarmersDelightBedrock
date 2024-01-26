import { MinecraftDimensionTypes, Scoreboard, ScoreboardObjective, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { vanillaCookingPotRecipe } from "../data/recipe/cookingPotRecipe";

const scoreboard: Scoreboard = world.scoreboard;
let bool = true;
let num = 0;

export class CookingPotRecipeRegistries {
    public static initCookingPotSco() {
        if (scoreboard.getObjective("farmersdelight:cooking_pot_recipe_registries")) {
            scoreboard.removeObjective("farmersdelight:cooking_pot_recipe_registries");
        }
        scoreboard.addObjective("farmersdelight:cooking_pot_recipe_registries", "farmersdelight:cooking_pot_recipe_registries");
    }
    public static initCookingPotScoRegistries() {
        system.runInterval(() => {
            const cookingPotRecipeRegistrieSco: ScoreboardObjective | undefined = scoreboard.getObjective("farmersdelight:cooking_pot_recipe_registries");
            if (!cookingPotRecipeRegistrieSco || !bool) return;
            for (const scores of cookingPotRecipeRegistrieSco.getScores()) {
                world.getDimension(MinecraftDimensionTypes.overworld).runCommandAsync(`function farmersdelight/cooking_pot_recipe_registries/${scores}`);
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
            if (!(json.cookingtime || json.ingredients || json.result)) return;
            if (!json.ingredients.length || !json.result.item) return;
            vanillaCookingPotRecipe.recipe.push(json);
            num++;
            console.warn(`已加载 §4${num}§f 个配方`);
        } catch (error) {
            return;
        }
    }
}