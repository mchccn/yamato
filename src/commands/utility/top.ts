import { Command } from "@aeroware/aeroclient/dist/types";
import { IPureShip, IShip } from "../../database/models/ship";
import users, { IUser } from "../../database/models/user";
import { IWeapon } from "../../database/models/weapon";
import Embed from "../../utils/Embed";

export default {
    name: "top",
    aliases: ["lb", "leaderboard", "best"],
    cooldown: 10,
    args: true,
    usage: "<property>",
    minArgs: 1,
    description: "Shows the leaderboard, sorted based on the property you specify.",
    details:
        "The currently supported properties are: `trophies`, `power`, `wins`, `battles`, `coins`, and `level`.",
    category: "utility",
    async callback({ message, args, client }) {
        const userArr = await users.find();

        let sorted: IUser[];

        if (["trophies", "wins", "battles", "coins", "level"].includes(args[0])) {
            sorted = sortArrByNumber(userArr, args[0], false);
        } else if (args[0] === "power") {
            sorted = userArr.sort(
                (a, b) =>
                    b.fleet.reduce((a, b) => a + shipPower(b), 0) -
                    a.fleet.reduce((a, b) => a + shipPower(b), 0)
            );
        } else {
            message.channel.send("This isn't a thing yet.");
            return "invalid";
        }

        sorted = sorted.slice(0, 10);

        let desc = (
            await Promise.all(
                sorted.map(
                    async (user, pos) =>
                        `${
                            [":first_place:", ":second_place:", ":third_place:"][pos] ||
                            ":medal:"
                        } - **${(await client.users.fetch(user._id))?.tag}** : ${
                            args[0] === "level" ? "level " : ""
                        }${
                            // @ts-ignore
                            sorted[pos][args[0]]
                        } ${args[0] === "level" ? "" : args[0]}`
                )
            )
        ).join("\n");

        if (args[0] === "power") {
            const powerSorted = sorted.map((e) => ({
                id: e._id,
                power: e.fleet.reduce((a, b) => a + shipPower(b), 0),
            }));

            desc = (
                await Promise.all(
                    powerSorted.map(
                        async (user, pos) =>
                            `${
                                [":first_place:", ":second_place:", ":third_place:"][pos] ||
                                ":medal:"
                            } - **${(await client.users.fetch(user.id))?.tag}** : ${
                                powerSorted[pos].power
                            } power`
                    )
                )
            ).join("\n");
        }

        return message.channel.send(
            new Embed().setTitle(`Leaderboard for ${args[0]}`).setDescription(desc)
        );
    },
} as Command;

function sortArrByNumber(arr: any[], prop: string, ascending: boolean) {
    return arr.sort((a, b) => (ascending ? a[prop] - b[prop] : b[prop] - a[prop]));
}

function shipPower(ship: IShip | IPureShip) {
    const classToNum = (str: IShip["class"]) => {
        switch (str) {
            case "CRUISER":
                return 1;
            case "FRIGATE":
                return 1.5;
            case "SUBMARINE":
                return 2;
            case "DESTROYER":
                return 3;
            case "BATTLESHIP":
                return 4;
            case "CARRIER":
                return 5;
            case "FLAGSHIP":
                return 6;
        }
    };

    const weaponClass = (str: IWeapon["type"]) => {
        switch (str) {
            case "LIGHT":
                return 1;
            case "MEDIUM":
                return 2;
            case "HEAVY":
                return 3;
        }
    };

    const weaponPower = (weapon: IWeapon) => {
        return weaponClass(weapon.type) + weapon.level;
    };

    return Math.round(
        (ship.weapons.heavies.reduce((a, b) => a + weaponPower(b), 0) +
            ship.weapons.mediums.reduce((a, b) => a + weaponPower(b), 0) +
            ship.weapons.lights.reduce((a, b) => a + weaponPower(b), 0)) *
            (classToNum(ship.class) / 2) +
            ship.level
    );
}
