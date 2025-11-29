import {
    ItemCustomComponent,
} from "@minecraft/server";
import { itemComponent } from "../../lib/EventSubscriber";

@itemComponent("farmersdelight:seed")
export class SeedComponent implements ItemCustomComponent {}