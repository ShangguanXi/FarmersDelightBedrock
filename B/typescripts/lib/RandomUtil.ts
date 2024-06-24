export class RandomUtil {
    public static probability(probability: number) {
        return Math.random() * 100 < probability
    }
    public static RandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }
}