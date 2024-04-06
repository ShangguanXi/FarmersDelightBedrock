import { MinecraftDimensionTypes, Scoreboard, ScoreboardObjective, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { vanillaItemList } from "../data/recipe/cookRecipe";

const scoreboard: Scoreboard = world.scoreboard;
let bool: boolean = true;
let num: number = 0;

export class CookRecipeRegistries {
    public static initCookScoRegistries() {
        system.runInterval(() => {
            const allSco: ScoreboardObjective[] | undefined = scoreboard.getObjectives();
            if (!allSco?.length || !bool) return;
            for (const sco of allSco) {
                const name: string = sco.displayName;
                const reg: RegExpMatchArray | null = name.match(/farmersdelight_(\w+)/);
                if (reg) {
                    world.getDimension(MinecraftDimensionTypes.overworld).runCommandAsync(`function farmersdelight/cook_recipe_registries/${reg[1]}`);
                }
            }
            bool = false;
        })
    }
    @methodEventSub(system.afterEvents.scriptEventReceive, { namespaces: ["farmersdelight"] })
    registries(args: any) {
        const id: string = args.id;
        if (id != "farmersdelight:cook") return;
        const message: string = args.message;
        try {
            
            vanillaItemList.unshift(message)
            num++;
            console.warn(`已加载 §4${num}§f 个烧炼配方`);
        } catch (error) {
            return;
        }
    }
}