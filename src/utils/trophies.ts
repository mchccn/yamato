import users, { IPureUser } from "../database/models/user";

export const leagues: Record<IPureUser["league"], number> = {
    BRONZE: 50,
    SILVER: 100,
    GOLD: 250,
    DIAMOND: 500,
    EMERALD: 1000,
    PLATINUM: 1750,
    EXPERT: 2500,
    MASTER: 3750,
    GRANDMASTER: 5000,
    SUPREME: 7500,
};

export default async function addTrophies(id: string, amount: number) {
    const user = (await users.findByIdAndUpdate(
        id,
        {
            $inc: { trophies: amount },
        },
        {
            upsert: true,
        }
    ))!;

    let oldLeague = user.league;

    user.league =
        (Object.keys(leagues) as IPureUser["league"][]).find(
            (key) => leagues[key] > user.trophies
        ) || "SUPREME";

    await user.save();

    if (oldLeague !== user.league) {
        //TODO: DM USER THAT THEY HAVE REACHED A NEW LEAGUE
    }
}
