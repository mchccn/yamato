import weapons, { IPureWeapon } from "./models/weapon";

(async () => {
    await Promise.all(
        ([
            {
                name: "cannon",
                cost: 20,
                damage: 10,
                description: "The basic cannon.",
                effect: "NONE",
                deviation: 2,
                critChance: 0.01,
                level: 1,
                maxLevel: 12,
                levelRequired: 0,
                type: "LIGHT",
            },
        ] as IPureWeapon[]).map(
            ({
                name,
                cost,
                damage,
                description,
                effect,
                levelRequired,
                type,
                critChance,
                deviation,
                level,
                maxLevel,
            }) =>
                weapons.findOneAndUpdate(
                    {
                        name,
                    },
                    {
                        name,
                        cost,
                        damage,
                        description,
                        effect,
                        levelRequired,
                        type,
                        critChance,
                        deviation,
                        level,
                        maxLevel,
                    },
                    {
                        upsert: true,
                    }
                )
        )
    );
})();
