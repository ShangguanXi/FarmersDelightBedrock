import {
    CustomComponentParameters,
    ItemComponentUseEvent,
    ItemCustomComponent,
} from "@minecraft/server";
import { itemComponent } from "../../lib/EventSubscriber";
import { mainForm } from "../../data/FarmersBook";

@itemComponent("farmersdelight:farmers_book")
export class FarmersBookComponent implements ItemCustomComponent {
    onUse(event: ItemComponentUseEvent, _: CustomComponentParameters) {
        mainForm(event.source);
    }
}