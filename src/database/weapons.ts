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
            {
                name: "varsity",
                cost: 50,
                damage: 20,
                description: "A larger cannon",
                effect: "NONE",
                deviation: 5,
                critChance: 0.02,
                level: 1,
                maxLevel: 12,
                levelRequired: 0,
                type: "MEDIUM",
            },
            {
                name: "silencer",
                cost: 100,
                damage: 50,
                description: "Powerful kinetic railgun.",
                effect: "KINETIC",
                deviation: 15,
                critChance: 0.05,
                level: 1,
                maxLevel: 15,
                levelRequired: 3,
                type: "HEAVY",
            },
            {
                name: "rattatatat",
                cost: 40,
                damage: 15,
                description: "Spraying machine gun.",
                effect: "NONE",
                deviation: 25,
                critChance: 0.01,
                level: 1,
                maxLevel: 15,
                levelRequired: 4,
                type: "LIGHT",
            },
            {
                name: "igniter",
                cost: 50,
                damage: 20,
                description: "Basically a flamethrower, but bigger.",
                effect: "PYRO",
                deviation: 5,
                critChance: 0.025,
                level: 1,
                maxLevel: 18,
                levelRequired: 6,
                type: "MEDIUM",
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
