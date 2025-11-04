import { system } from "@minecraft/server";

// 避免多个订阅回调对同一条script event的id进行比较，优化附属注册速度
export const MESSAGE_HANDLERS = new Map<string, (message: string) => void>();

// 原始写法在阴暗的角落里就是好写法
system.afterEvents.scriptEventReceive.subscribe(
    (event) => MESSAGE_HANDLERS.get(event.id)?.(event.message),
    { namespaces: ["farmersdelight"] }
);