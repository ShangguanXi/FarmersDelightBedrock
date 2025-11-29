import {
    CustomComponentParameters,
    ItemComponentUseOnEvent,
    ItemCustomComponent,
} from "@minecraft/server";
import { itemComponent } from "../../lib/EventSubscriber";

export type CookableComponentParams = {
    result: string;
    time?: number
};

@itemComponent("farmersdelight:cookable")
export class CookableComponent implements ItemCustomComponent {
    /**
     * @deprecated
     */
    onUseOn(args: ItemComponentUseOnEvent, param: CustomComponentParameters): void {}
}
