import { ScoreboardObjective, system, world } from "@minecraft/server";
import {
    CuttingBoardRecipe,
    CuttingBoardTool,
    CuttingBoardIngredient,
    CuttingBoardResult,
    cuttingBoardRecipeManager
} from "../data/recipe/cuttingBoardRecipe";
import { subscribeEvent } from "../lib/EventSubscriber";

let bool: boolean = true;
let num: number = 0;

export class CuttingBoardRegistries {
    public static initCuttingBoardScoRegistries() {
        system.runInterval(() => {
            const allSco: ScoreboardObjective[] | undefined = world.scoreboard.getObjectives();
            if (!allSco?.length || !bool) return;
            for (const sco of allSco) {
                const name: string = sco.displayName;
                const reg: RegExpMatchArray | null = name.match(/farmersdelight_(\w+)/);
                if (reg) {
                    world.getDimension("overworld").runCommand(`function farmersdelight/cutting_board_recipe_registries/${reg[1]}`);
                }
            }
            bool = false;
        })
    }

    /**
     * 通过 scriptEvent 注册砧板配方
     * message 格式 (JSON):
     * {
     *   "ingredients": { "item": "mod:item_id" } 或 { "tag": "mod:tag_id" } 或数组,
     *   "tool": { "tag": "minecraft:is_axe" } 或 { "item": "mod:tool_id" },
     *   "result": [{ "item": "mod:output_id", "count": 1, "chance": 1.0 }],
     *   "is_block_type": true/false,
     *   "sound": "use.wood",
     *   "exp": 0  // 可选
     * }
     */
    @subscribeEvent(system.afterEvents.scriptEventReceive, { namespaces: ["farmersdelight"] })
    registries(args: any) {
        const id: string = args.id;
        if (id != "farmersdelight:cutting_board_recipe") return;
        const message: string = args.message;

        try {
            const data = JSON.parse(message);
            const ingredients: CuttingBoardIngredient | CuttingBoardIngredient[] = data.ingredients;
            if (!ingredients) { console.warn(`[FarmersDelight] Missing 'ingredients' field in cutting board recipe: ${message}`); return; }

            const tool: CuttingBoardTool = data.tool;
            if (!tool || (!tool.tag && !tool.item)) { console.warn(`[FarmersDelight] Missing or invalid 'tool' field in cutting board recipe: ${message}`); return; }

            const result: CuttingBoardResult[] = data.result;
            if (!result || !Array.isArray(result) || result.length === 0) { console.warn(`[FarmersDelight] Missing or empty 'result' field in cutting board recipe: ${message}`); return; }

            const is_block_type: boolean = !!data.is_block_type;
            const sound: string = data.sound ?? "use.wood";

            const recipe: CuttingBoardRecipe = {
                ingredients,
                tool,
                result,
                is_block_type,
                sound,
            };

            // 可选的经验值
            if (typeof data.exp === "number") {
                recipe.exp = data.exp;
            }

            cuttingBoardRecipeManager.addRecipe(recipe);
        } catch (e) {
            console.warn(`[FarmersDelight] Failed to register cutting board recipe: ${e}\nOriginal message: ${message}`);
        }
    }
}