export function randomInt(bound: number) {
    return Math.floor(Math.random() * bound);
}

export class RandomUtil {
    public static probability(probability: number) {
        return Math.random() * 100 < probability
    }
}