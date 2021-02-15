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
            {
                name: "shredder",
                cost: 300,
                class: "DESTROYER",
                description: "Good firepower and speed.",
                health: 120,
                levelRequired: 5,
                speed: 25,
                weapons: {
                    heavies: [],
                    heavySlots: 1,
                    mediums: [],
                    mediumSlots: 2,
                    lights: [],
                    lightSlots: 0,
                },
            },
            {
                name: "pulsar",
                cost: 350,
                class: "BATTLESHIP",
                description: "Light but durable.",
                health: 160,
                levelRequired: 8,
                speed: 22,
                weapons: {
                    heavies: [],
                    heavySlots: 0,
                    mediums: [],
                    mediumSlots: 0,
                    lights: [],
                    lightSlots: 4,
                },
            },
            {
                name: "hospitality",
                cost: 400,
                class: "FRIGATE",
                description: "Supportive ship with decent firepower.",
                health: 140,
                levelRequired: 12,
                speed: 30,
                weapons: {
                    heavies: [],
                    heavySlots: 1,
                    mediums: [],
                    mediumSlots: 0,
                    lights: [],
                    lightSlots: 1,
                },
            },
            {
                name: "abyss",
                cost: 500,
                class: "CARRIER",
                description: "A small but speedy carrier.",
                health: 140,
                levelRequired: 15,
                speed: 35,
                weapons: {
                    heavies: [],
                    heavySlots: 2,
                    mediums: [],
                    mediumSlots: 0,
                    lights: [],
                    lightSlots: 0,
                },
            },
            {
                name: "uboat",
                cost: 500,
                class: "SUBMARINE",
                description: "*unterseeboot intensifies*",
                health: 140,
                levelRequired: 15,
                speed: 35,
                weapons: {
                    heavies: [],
                    heavySlots: 2,
                    mediums: [],
                    mediumSlots: 0,
                    lights: [],
                    lightSlots: 0,
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
