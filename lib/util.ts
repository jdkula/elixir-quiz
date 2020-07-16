export function randomInt(low: number, high: number): number {
    return Math.floor(Math.random() * (high - low)) + low;
}

export function randomized<T>(arr: T[]): T[] {
    const copy = [...arr];
    const randomVersion: T[] = [];

    for (let i = 0; i < arr.length; i++) {
        randomVersion.push(copy.splice(randomInt(0, copy.length), 1)[0]);
    }

    return randomVersion;
}
