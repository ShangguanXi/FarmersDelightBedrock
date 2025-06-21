import { BlockEntity } from "./BlockEntity";
const xOffset = 0.3;
const yOffset = 0.2;
const stoveOffsets = [
    {
        x: xOffset,
        y: yOffset
    },
    {
        x: 0,
        y: yOffset
    },
    {
        x: -xOffset,
        y: yOffset
    },
    {
        x: xOffset,
        y: -yOffset
    },
    {
        x: 0,
        y: -yOffset
    },
    {
        x: -xOffset,
        y: -yOffset
    }
];
function itemStackArr(scores) {
    let arr = [];
    for (const itemStackData of scores) {
        const itemStack = itemStackData.participant.displayName;
        if (itemStack != 'amount') {
            const id = itemStack.split('/');
            arr.push(id[0]);
        }
    }
    return arr;
}
export class StoveBlockEntity extends BlockEntity {
}
//# sourceMappingURL=StoveBlockEntity.js.map