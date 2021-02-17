import AeroClient from "@aeroware/aeroclient";
import ships from "../database/models/ship";
import users from "../database/models/user";
import weapons from "../database/models/weapon";
import { coins, shipSlots } from "./rewards";

export function expNeeded(level: number): number {
    return Math.round(Math.sqrt(level) * 100);
}

export default async function addExp(id: string, amount: number, client: AeroClient) {
    const user = (await users.findById(id))!;

    let exp = Math.round(amount * (1 + user.rank));
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

        const unlockedWeapons = await weapons.find({
            levelRequired: {
                $lte: level,
                $gt: oldLevel,
            },
        });

        const unlockedShips = await ships.find({
            levelRequired: {
                $lte: level,
                $gt: oldLevel,
            },
        });

        const apiUser = await client.users.fetch(id);

        const dm = await apiUser.createDM();

        await dm.send(
            `You leveled up and got **${reward}** coins${
                oldSlots !== user.shipSlots ? " **and unlocked a new ship slot**" : ""
            }! You are now level ${level} and unlocked:\n${
                (
                    unlockedShips.map((s) => `**${s.name}**`).join("\n") +
                    "\n" +
                    unlockedWeapons.map((s) => `**${s.name}**`).join("\n")
                ).trim() || "**nothing**"
            }`
        );
    }
}
