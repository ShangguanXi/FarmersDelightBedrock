import {
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    CustomComponentParameters,
} from "@minecraft/server";
import { blockComponent } from "../../lib/EventSubscriber";

@blockComponent("farmersdelight:interact")
export class InteractComponent implements BlockCustomComponent {
    onPlayerInteract(_: BlockComponentPlayerInteractEvent, __: CustomComponentParameters): void {}
}
