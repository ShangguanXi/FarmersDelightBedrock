import { ScoreboardObjective, system, world } from "@minecraft/server";
import { vanillaItemList } from "../data/recipe/cookRecipe";
import { subscribeEvent } from "../lib/EventSubscriber";

;
let bool: boolean = true;
let num: number = 0;

export class CookRecipeRegistries {
    public static initCookScoRegistries() {
        system.runInterval(() => {
            const allSco: ScoreboardObjective[] | undefined = world.scoreboard.getObjectives();
            if (!allSco?.length || !bool) return;
            for (const sco of allSco) {
                const name: string = sco.displayName;
                const reg: RegExpMatchArray | null = name.match(/farmersdelight_(\w+)/);
                if (reg) {
                    world.getDimension("overworld").runCommand(`function farmersdelight/cook_recipe_registries/${reg[1]}`);
                }
            }
            bool = false;
        })
    }
    @subscribeEvent(system.afterEvents.scriptEventReceive, { namespaces: ["farmersdelight"] })
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