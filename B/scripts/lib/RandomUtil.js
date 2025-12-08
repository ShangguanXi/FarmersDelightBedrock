export function randomInt(bound) {
    return Math.floor(Math.random() * bound);
}
export class RandomUtil {
    static probability(probability) {
        return Math.random() * 100 < probability;
    }
}
