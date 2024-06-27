import { BlockComponentTickEvent, BlockCustomComponent, BlockComponentPlayerPlaceBeforeEvent, WorldInitializeBeforeEvent, system, world, Direction } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";

class TatamMatComponent implements BlockCustomComponent {
    constructor() {
        this.onTick = this.onTick.bind(this);
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
    }
    beforeOnPlayerPlace(args: BlockComponentPlayerPlaceBeforeEvent): void {
        const block = args.block;
        let { x, y, z } = block.location;
        const dimension = block.dimension;
        const face = args.face;
        let thisPerm: string
        let neighborPerm: string
        switch (face) {
            case Direction.North:
                thisPerm = 'south';
                neighborPerm = 'north';
                z += 1;
                break;
            case Direction.South:
                thisPerm = 'north';
                neighborPerm = 'south';
                z -= 1;
                break;
            case Direction.East:
                thisPerm = 'west';
                neighborPerm = 'east';
                x -= 1;
                break;
            case Direction.West:
                thisPerm = 'east';
                neighborPerm = 'west';
                x += 1;
                break;
            case Direction.Up:
                thisPerm = 'down';
                neighborPerm = 'up';
                y -= 1;
                break;
            case Direction.Down:
                thisPerm = 'up';
                neighborPerm = 'down';
                y += 1;
                break;
            default:
                break;
        };
        system.run(()=>{
            const neighborBlock = dimension.getBlock({ x, y, z })
            if(neighborBlock?.typeId=="farmersdelight:tatami"&&neighborBlock.permutation.getState("farmersdelight:connection")=="none"){
                block.setPermutation(block.permutation.withState('farmersdelight:connection', thisPerm));
                neighborBlock?.setPermutation(neighborBlock.permutation.withState("farmersdelight:connection",neighborPerm));
            }
        })
       
        
    }
    onTick(args: BlockComponentTickEvent): void {

        const block = args.block;
        const connection = block.permutation.getState('farmersdelight:connection') as string;
        if (!connection) return;

        const location = block.location;
        const dimension = args.dimension;

        const directions: { [key: string]: { x: number, y: number, z: number } }= {
            "west": { x: -1, y: 0, z: 0 },
            "east": { x: 1, y: 0, z: 0 },
            "north": { x: 0, y: 0, z: -1 },
            "south": { x: 0, y: 0, z: 1 },
            "up": { x: 0, y: 1, z: 0 },
            "down": { x: 0, y: -1, z: 0 }
        };
        if(connection!="none"){
            const neighborBlock = dimension?.getBlock({ x: location.x + directions[connection].x, y: location.y + directions[connection].y, z: location.z + directions[connection].z })
            if(!neighborBlock)return
            if(neighborBlock.typeId!="farmersdelight:tatami"){
                block.setPermutation(block.permutation.withState("farmersdelight:connection","none"))
            }
        }
    }

}
export class TatamComponentRegister {
    @methodEventSub(world.beforeEvents.worldInitialize)
    register(args: WorldInitializeBeforeEvent) {
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:tatami', new TatamMatComponent());
    }

}
