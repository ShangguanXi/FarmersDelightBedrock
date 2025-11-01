import { Player, ScoreboardObjective, world, system } from "@minecraft/server";
import { MESSAGE_HANDLERS } from "./MessageDispatcher";
export const TickEvent = {
    subscribe(callback: (_: void) => void) {
        system.runInterval(callback);
    },
} as const;

// 替代原本lib/event/里的TickEvent（未使用）
export const PlayerTickEvent = {
    subscribe(callback: (player: Player) => void) {
        system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                callback(player);
            }
        });
    },
} as const;

export const ReceiveMessageEvent = {
    subscribe(callback: (message: string) => void, identifier: string) {
        MESSAGE_HANDLERS.set(identifier, callback);
    },
} as const;

export const ScoreboardLoadEvent = {
    subscribe(callback: (objectives: ScoreboardObjective[]) => void) {
        system.run(() => {
            const objectives = world.scoreboard.getObjectives();
            if (objectives?.length) {
                callback(objectives)
            }
        });
    },
} as const;
