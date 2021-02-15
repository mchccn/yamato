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
                levelRequired: 0,
                type: "LIGHT",
            },
        ] as IPureWeapon[]).map(
            ({ name, cost, damage, description, effect, levelRequired, type }) =>
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
                    },
                    {
                        upsert: true,
                    }
                )
        )
    );
})();
