import {
    ItemCustomComponent,
} from "@minecraft/server";
import { itemComponent } from "../../lib/EventSubscriber";

type LootItem = [string, number, number?]
export type CuttingBroadComponentParams = {
    loot: LootItem[];
    is_block?: boolean
    tool: {
        type:  "tag" | "item",
        name: string

    }
};

@itemComponent("farmersdelight:cuttable")
export class CuttableComponent implements ItemCustomComponent {}