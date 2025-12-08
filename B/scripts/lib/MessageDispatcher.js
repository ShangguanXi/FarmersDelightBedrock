import { system } from "@minecraft/server";
export const MESSAGE_HANDLERS = new Map();
system.afterEvents.scriptEventReceive.subscribe((event) => MESSAGE_HANDLERS.get(event.id)?.(event.message), { namespaces: ["farmersdelight"] });
