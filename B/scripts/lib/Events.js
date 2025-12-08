import { world, system } from "@minecraft/server";
import { MESSAGE_HANDLERS } from "./MessageDispatcher";
export const TickEvent = {
    subscribe(callback) {
        system.runInterval(callback);
    },
};
export const PlayerTickEvent = {
    subscribe(callback) {
        system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                callback(player);
            }
        });
    },
};
export const ReceiveMessageEvent = {
    subscribe(callback, identifier) {
        MESSAGE_HANDLERS.set(identifier, callback);
    },
};
export const ScoreboardLoadEvent = {
    subscribe(callback) {
        system.run(() => {
            const objectives = world.scoreboard.getObjectives();
            if (objectives?.length) {
                callback(objectives);
            }
        });
    },
};
