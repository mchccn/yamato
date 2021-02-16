import AeroClient from "@aeroware/aeroclient";
import users from "../database/models/user";

export function expNeeded(level: number): number {
    return Math.sqrt(level) * 100;
}

export default async function addExp(id: string, amount: number, client: AeroClient) {
    const user = (await users.findByIdAndUpdate(
        id,
        {
            $inc: { exp: amount },
        },
        {
            upsert: true,
        }
    ))!;

    let exp = user.exp;
    let oldLevel = user.level;
    let level = user.level;

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

    if (oldLevel !== level) {
        const unlocked = [];

        const apiUser = await client.users.fetch(id);

        const dm = await apiUser.createDM();

        await dm.send(`**You leveled up! You are now level ${level} and unlocked:**`);
    }
}
