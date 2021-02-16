import AeroClient from "@aeroware/aeroclient";
import users from "../database/models/user";
import { coins, shipSlots } from "./rewards";

export function expNeeded(level: number): number {
    return Math.round(Math.sqrt(level) * 100);
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

        needed = expNeeded(level);
    }

    await users.findByIdAndUpdate(id, {
        level,
        exp,
    });

    if (oldLevel !== level) {
        const reward = coins[level] || 10000;

        const oldSlots = user.shipSlots;

        if (shipSlots[level] && shipSlots[level] > user.shipSlots)
            user.shipSlots = shipSlots[level];

        await user.save();

        const unlocked = [];

        const apiUser = await client.users.fetch(id);

        const dm = await apiUser.createDM();

        await dm.send(
            `You leveled up and got **${reward}** coins${
                oldSlots !== user.shipSlots ? " **and unlocked a new ship slot**" : ""
            }! You are now level ${level} and unlocked:`
        );
    }
}
