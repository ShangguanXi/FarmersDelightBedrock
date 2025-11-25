import { ItemCustomComponent } from "@minecraft/server";
import { itemComponent } from "../../lib/EventSubscriber";

@itemComponent("farmersdelight:increase_production")
export class IncreaseProductionComponent implements ItemCustomComponent {}
