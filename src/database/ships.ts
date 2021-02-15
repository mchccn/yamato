import ships, { IPureShip } from "./models/ship";

(async () => {
    await Promise.all(
        ([
            {
                name: "cruiser",
                cost: 50,
                class: "BATTLESHIP",
                description: "A standard ship.",
                health: 100,
                levelRequired: 0,
                speed: 20,
                weapons: {
                    heavies: [],
                    heavySlots: 0,
                    mediums: [],
                    mediumSlots: 1,
                    lights: [],
                    lightSlots: 2,
                },
            },
            {
                name: "speeder",
                cost: 150,
                class: "CRUISER",
                description: "Super fast and light.",
                health: 80,
                levelRequired: 2,
                speed: 40,
                weapons: {
                    heavies: [],
                    heavySlots: 0,
                    mediums: [],
                    mediumSlots: 0,
                    lights: [],
                    lightSlots: 2,
                },
            },
        ] as IPureShip[]).map(
            ({
                name,
                cost,
                class: _class,
                description,
                health,
                levelRequired,
                speed,
                weapons,
            }) =>
                ships.findOneAndUpdate(
                    {
                        name,
                    },
                    {
                        name,
                        cost,
                        class: _class,
                        description,
                        health,
                        levelRequired,
                        speed,
                        weapons,
                    },
                    {
                        upsert: true,
                    }
                )
        )
    );
})();
