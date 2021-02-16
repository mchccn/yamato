import AeroClient from "@aeroware/aeroclient";
import users, { IPureUser } from "../database/models/user";

export const supplyCrates: Record<
    IPureUser["league"],
    {
        coins: {
            max: number;
            min: number;
        };
        exp: {
            max: number;
            min: number;
        };
    }
> = {
    BRONZE: {
        coins: {
            max: 50,
            min: 30,
        },
        exp: {
            max: 10,
            min: 5,
        },
    },
    SILVER: {
        coins: {
            max: 75,
            min: 45,
        },
        exp: {
            max: 20,
            min: 12,
        },
    },
    GOLD: {
        coins: {
            max: 120,
            min: 60,
        },
        exp: {
            max: 25,
            min: 15,
        },
    },
    DIAMOND: {
        coins: {
            max: 160,
            min: 90,
        },
        exp: {
            max: 40,
            min: 20,
        },
    },
    EMERALD: {
        coins: {
            max: 200,
            min: 120,
        },
        exp: {
            max: 50,
            min: 30,
        },
    },
    PLATINUM: {
        coins: {
            max: 250,
            min: 150,
        },
        exp: {
            max: 65,
            min: 45,
        },
    },
    EXPERT: {
        coins: {
            max: 300,
            min: 175,
        },
        exp: {
            max: 75,
            min: 50,
        },
    },
    MASTER: {
        coins: {
            max: 375,
            min: 250,
        },
        exp: {
            max: 100,
            min: 65,
        },
    },
    GRANDMASTER: {
        coins: {
            max: 425,
            min: 375,
        },
        exp: {
            max: 125,
            min: 75,
        },
    },
    SUPREME: {
        coins: {
            max: 500,
            min: 400,
        },
        exp: {
            max: 150,
            min: 100,
        },
    },
};

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

export default async function addTrophies(id: string, amount: number, client: AeroClient) {
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

    if (oldLeague !== user.league && leagues[user.league] > leagues[oldLeague]) {
        const apiUser = await client.users.fetch(id);

        const dm = await apiUser.createDM();

        await dm.send(`**You have advanced to ${user.league.toLowerCase()} league!**`);
    }
}
