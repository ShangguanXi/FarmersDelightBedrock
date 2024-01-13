var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { system, world } from "@minecraft/server";
import { methodEventSub } from "../eventHelper";
export const playerMap = new Map();
export class TickEvent {
    subscribe(callBack) {
        this.playerJoin;
        this.playerLeave;
        system.runInterval(() => {
            for (const [key, value] of playerMap) {
                const player = world.getEntity(value);
                callBack(player);
            }
        });
    }
    playerJoin(args) {
        playerMap.set(args.playerName, args.playerId);
    }
    playerLeave(args) {
        playerMap.delete(args.playerName);
    }
}
__decorate([
    methodEventSub(world.afterEvents.playerJoin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TickEvent.prototype, "playerJoin", null);
__decorate([
    methodEventSub(world.afterEvents.playerLeave),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TickEvent.prototype, "playerLeave", null);
//# sourceMappingURL=TickEvent.js.map