import users from "../database/models/user";

export function expNeeded(level: number): number {
    return Math.sqrt(level) * 100;
}

export default async function addExp(id: string, amount: number) {
    const userInfo = (await users.findByIdAndUpdate(
        id,
        {
            $inc: { exp: amount },
        },
        {
            upsert: true,
        }
    ))!;

    let exp = userInfo.exp;
    let level = userInfo.level;

    let needed = expNeeded(level);

    while (exp >= needed) {
        level++;
        exp -= needed;

        await users.findByIdAndUpdate(id, {
            level,
            exp,
        });

        needed = expNeeded(level);
    }
}
