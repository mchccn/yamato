export const coins = new Array(100).fill``.map((_, i) => Math.round(10 * Math.sqrt(i ** 3)));

export const shipSlots: {
    [level: number]: number;
} = {
    0: 1,
    4: 2,
    10: 3,
    18: 4,
    25: 5,
    35: 6,
    50: 7,
    60: 8,
    75: 9,
    100: 10,
};
