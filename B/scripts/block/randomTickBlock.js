import { system } from "@minecraft/server";
import { organicCompost } from "./randomTick/organicCompost";
import { richSoilFarmland } from "./randomTick/richSoilFarmland";

function randomTick(args) {
    switch (args.id) {
        case 'farmersdelight:organic_transfer':
            organicCompost(args);
            break;
        case 'farmersdelight:rich_soil_farmland_tick':
            richSoilFarmland(args);
            break;
    }
}

system.afterEvents.scriptEventReceive.subscribe(randomTick, { 'namespaces': ['farmersdelight'] });