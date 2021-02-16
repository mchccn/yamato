import { Command } from "@aeroware/aeroclient/dist/types";
import { IPureShip, IShip } from "../../database/models/ship";
import users, { IUser } from "../../database/models/user";
import { IPureWeapon, IWeapon } from "../../database/models/weapon";
import Embed from "../../utils/Embed";

export default {
    name: "top",
    aliases: ["lb", "leaderboard"],
    cooldown: 30,
    args: true,
    minArgs: 1,
    description:
        "Shows the leaderboard, sorted based on the property you specify.",
    details:
        "The currently supported proprties are: `trophies`, `power`, `wins`, `battles`, `coins`, and `level`.",
    category: "general",
    usage: "<property>",
    async callback({ message, args, client }) {
        const userArr = await users.find();
        let sorted: IUser[];

        if (/(trophies)|(wins)|(battles)|(coins)|(level)/.test(args[0])) {
            sorted = sortArrByNumber(userArr, args[0], false);
        } else if (args[0] === "power") {
            sorted = userArr.sort((a, b) => {
                const aPower = a.fleet.reduce((a, b) => a + shipPower(b), 0);
                const bPower = b.fleet.reduce((a, b) => a + shipPower(b), 0);

                return bPower - aPower;
            });
        } else {
            message.channel.send("This isn't a thing yet.");
            return;
        }

        sorted.length = sorted.length < 10 ? sorted.length : 10;

        let desc = (
            await Promise.all(
                sorted.map(
                    async (user, pos) =>
                        `${
                            [
                                ":first_place:",
                                ":second_place:",
                                ":third_place:",
                            ][pos] || ":medal:"
                        } - **${(await client.users.fetch(user._id))?.tag}**: ${
                            // @ts-ignore
                            sorted[pos][args[0]]
                        } ${args[0]}`
                )
            )
        ).join("\n");

        if (args[0] === "power") {
            const powerSorted = sorted.map((e) => {
                return {
                    id: e._id,
                    power: e.fleet.reduce((a, b) => a + shipPower(b), 0),
                };
            });

            desc = (
                await Promise.all(
                    powerSorted.map(
                        async (user, pos) =>
                            `${
                                [
                                    ":first_place:",
                                    ":second_place:",
                                    ":third_place:",
                                ][pos] || ":medal:"
                            } - **${
                                (await client.users.fetch(user.id))?.tag
                            }**: ${powerSorted[pos].power} power`
                    )
                )
            ).join("\n");
        }

        const embed = new Embed()
            .setTitle(`Leaderboard for ${args[0]}`)
            .setDescription(desc);

        message.channel.send(embed);
    },
} as Command;

/**
 * Sorts an array in the specified order based on a numerical property.
 * @param arr an array of objects
 * @param prop the numerical property to sort by
 * @param ascending sort by ascending order
 */
function sortArrByNumber(arr: any[], prop: string, ascending: boolean) {
    arr.forEach((e, i) => {
        if (!(prop in e))
            throw new TypeError(
                `Property ${prop} does not exist in element ${e} with index ${i}`
            );
        else if (typeof e[prop] !== "number")
            throw new TypeError(
                `Property ${prop} in element ${e} with index ${i} is not a number`
            );
    });

    return arr.sort((a, b) => {
        return ascending ? a[prop] - b[prop] : b[prop] - a[prop];
    });
}

/**
 * Returns the power of the ship.
 * @param ship the ship to calculate power of
 * @returns the power of the ship
 */
function shipPower(ship: IShip | IPureShip) {
    const classToNum = (
        str:
            | "BATTLESHIP"
            | "FLAGSHIP"
            | "FRIGATE"
            | "CARRIER"
            | "CRUISER"
            | "DESTROYER"
            | "SUBMARINE"
    ) => {
        switch (str) {
            case "CRUISER":
                return 1;
            case "FRIGATE":
                return 2;
            case "SUBMARINE":
                return 3;
            case "DESTROYER":
                return 3;
            case "BATTLESHIP":
                return 4;
            case "CARRIER":
                return 5;
            case "FLAGSHIP":
                return 5;
        }
    };

    const weaponPower = (weapon: IWeapon | IPureWeapon) => {
        const weaponClass = (str: "LIGHT" | "MEDIUM" | "HEAVY") => {
            switch (str) {
                case "LIGHT":
                    return 1;
                case "MEDIUM":
                    return 2;
                case "HEAVY":
                    return 3;
            }
        };

        return weaponClass(weapon.type) + weapon.level;
    };

    return (
        (ship.weapons.heavies.reduce((a, b) => a + weaponPower(b), 0) +
            ship.weapons.mediums.reduce((a, b) => a + weaponPower(b), 0) +
            ship.weapons.lights.reduce((a, b) => a + weaponPower(b), 0)) *
            (classToNum(ship.class) / 2) +
        ship.level
    );
}
